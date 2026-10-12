#!/usr/bin/env node

import { copyFile, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { prepareBuildRoot, removeBuildRoot } from './_lib/build-root.mjs';
import { abort, info, success, warn } from './_lib/console.mjs';
import { CORE_DESTINATION, REPO_ROOT } from './_lib/paths.mjs';
import { detectPlatform } from './_lib/platform.mjs';
import { promptConfirmation } from './_lib/prompt-confirmation.mjs';
import { readReleaseNotesSection } from './_lib/read-release-notes-section.mjs';
import { captureCommand, runCommand } from './_lib/run-command.mjs';
import { signCore } from './_lib/sign-core.mjs';
import { toTauriTarget } from './_lib/tauri-target.mjs';

const PACKAGE_JSON_PATH = join(REPO_ROOT, 'package.json');
const RELEASE_DIR = join(REPO_ROOT, 'release');
const PRODUCT_NAME = 'Alent.Red';
const UPDATER_MANIFEST_NAME = 'latest.json';

function parseArgs() {
  const argv = process.argv.slice(2);
  return {
    isForce: argv.includes('force'),
    isNoConfirm: argv.includes('no-confirm'),
  };
}

async function readVersion() {
  const raw = await readFile(PACKAGE_JSON_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  if (typeof parsed.version !== 'string' || parsed.version.length === 0) {
    abort('package.json has no version set.');
  }
  return parsed.version;
}

async function preflightGh() {
  const versionResult = await captureCommand('gh', ['--version']);
  if (versionResult.code !== 0) {
    abort('GitHub CLI (gh) is not installed. Install from https://cli.github.com/');
  }
  const authResult = await captureCommand('gh', ['auth', 'status']);
  if (authResult.code !== 0) {
    abort('GitHub CLI is not authenticated. Run: gh auth login');
  }
}

async function preflightGitPushed() {
  const statusResult = await captureCommand('git', ['status', '--porcelain'], { cwd: REPO_ROOT });
  if (statusResult.code !== 0) {
    abort(`git status failed: ${statusResult.stderr}`);
  }
  if (statusResult.stdout.trim().length > 0) {
    abort('Working tree is not clean. Commit or stash before releasing.');
  }
  await runCommand('git', ['fetch', '--quiet', 'origin'], { cwd: REPO_ROOT });
  const containsResult = await captureCommand(
    'git',
    ['branch', '--remotes', '--contains', 'HEAD'],
    {
      cwd: REPO_ROOT,
    },
  );
  if (containsResult.code !== 0 || containsResult.stdout.trim().length === 0) {
    abort('HEAD is not pushed to origin. Push before releasing — the tag is created on HEAD.');
  }
}

async function readRepository() {
  const result = await captureCommand(
    'gh',
    ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner'],
    {
      cwd: REPO_ROOT,
    },
  );
  if (result.code !== 0) {
    abort(`Could not resolve the GitHub repository from origin: ${result.stderr}`);
  }
  return result.stdout.trim();
}

async function readExistingAssets(tag) {
  const result = await captureCommand(
    'gh',
    ['release', 'view', tag, '--json', 'assets', '--jq', '.assets[].name'],
    { cwd: REPO_ROOT },
  );
  if (result.code !== 0) {
    return null;
  }
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

async function preflightAssetsAvailable(tag, assetNames, isForce) {
  const existing = await readExistingAssets(tag);
  if (existing === null) {
    info(`  release ${tag} does not exist yet, it will be created`);
    return;
  }
  const conflicting = assetNames.filter((name) => existing.includes(name));
  if (conflicting.length === 0) {
    info(`  release ${tag} exists, assets will be added`);
    return;
  }
  if (!isForce) {
    abort(
      `Assets already published on release ${tag}:\n  ${conflicting.join('\n  ')}\n` +
        'Bump package.json#version, or re-run with `force` to overwrite: npm run release force',
    );
  }
  const confirmed = await promptConfirmation(
    `Type "yes" to OVERWRITE ${conflicting.join(', ')} on release ${tag}:`,
  );
  if (!confirmed) {
    abort('Aborted.');
  }
}

function preflightSigning() {
  if (process.platform === 'darwin') {
    const required = ['APPLE_SIGNING_IDENTITY', 'APPLE_ID', 'APPLE_PASSWORD', 'APPLE_TEAM_ID'];
    const missing = required.filter((name) => {
      const value = process.env[name];
      return value === undefined || value.length === 0;
    });
    if (missing.length > 0) {
      abort(
        `Missing required environment variables for macOS signing/notarization:\n  ${missing.join('\n  ')}`,
      );
    }
    return;
  }
  if (process.platform === 'win32') {
    // Windows signing is intentionally skipped for now — releases ship
    // unsigned and users see SmartScreen warnings until Authenticode signing
    // lands. The build still produces a valid NSIS installer.
    warn('Windows signing is skipped — installer will be unsigned.');
  }
}

function preflightUpdaterKey() {
  const value = process.env.TAURI_SIGNING_PRIVATE_KEY;
  if (value === undefined || value.length === 0) {
    abort(
      'Missing TAURI_SIGNING_PRIVATE_KEY.\n' +
        'Without it, tauri build produces an UNSIGNED .app.tar.gz that the updater cannot verify.\n' +
        'Generate the keypair with: npm run tauri signer generate -- -w ~/.tauri/alent-red-updater.key',
    );
  }
}

async function preflightCoreStaged() {
  try {
    const stats = await stat(CORE_DESTINATION);
    if (!stats.isDirectory()) {
      abort(`Core path exists but is not a directory: ${CORE_DESTINATION}`);
    }
  } catch (caught) {
    if (caught.code === 'ENOENT') {
      abort(`Core not staged at ${CORE_DESTINATION}.\n` + 'Run `npm run core:install` first.');
    }
    throw caught;
  }
}

// Rust embeds absolute source paths (panic locations, debug info) for the
// crate and every dependency under ~/.cargo. Remapping them makes the binary
// independent of the directory layout of the machine that built it.
function buildRustFlags(buildRoot) {
  const inherited = process.env.RUSTFLAGS ?? '';
  const remaps = [
    `--remap-path-prefix=${buildRoot}=/build`,
    `--remap-path-prefix=${homedir()}=/home/builder`,
  ];
  return `${inherited} ${remaps.join(' ')}`.trim();
}

async function buildTauri(buildRoot) {
  info('Building Tauri bundle (this takes several minutes)...');
  await runCommand('npm', ['run', 'app:build'], {
    cwd: buildRoot,
    env: { ...process.env, RUSTFLAGS: buildRustFlags(buildRoot) },
  });
  return join(buildRoot, 'src-tauri', 'target', 'release', 'bundle');
}

async function findBuildArtifact(bundleDir, relativePath) {
  const fullPath = join(bundleDir, relativePath);
  try {
    await stat(fullPath);
    return fullPath;
  } catch {
    return null;
  }
}

async function locateMacosArtifacts(bundleDir, version) {
  const dmgCandidates = [
    `dmg/${PRODUCT_NAME}_${version}_aarch64.dmg`,
    `dmg/${PRODUCT_NAME}_${version}_x64.dmg`,
    `dmg/${PRODUCT_NAME}_${version}_universal.dmg`,
  ];
  let dmg = null;
  for (const candidate of dmgCandidates) {
    const found = await findBuildArtifact(bundleDir, candidate);
    if (found !== null) {
      dmg = found;
      break;
    }
  }
  if (dmg === null) {
    abort(`Could not find .dmg under ${bundleDir}/dmg/`);
  }

  const tarball = join(bundleDir, 'macos', `${PRODUCT_NAME}.app.tar.gz`);
  const signature = join(bundleDir, 'macos', `${PRODUCT_NAME}.app.tar.gz.sig`);
  return { dmg, tarball, signature };
}

async function locateWindowsArtifacts(bundleDir, version) {
  // Tauri 2 NSIS reuses the setup .exe as the updater payload — there is no
  // separate .nsis.zip artifact (that was Tauri 1's v1Compatible mode). The
  // .sig file is generated alongside when createUpdaterArtifacts is true.
  const installerCandidates = [
    `nsis/${PRODUCT_NAME}_${version}_x64-setup.exe`,
    `nsis/${PRODUCT_NAME}_${version}_x64_en-US.exe`,
  ];
  let installer = null;
  for (const candidate of installerCandidates) {
    const found = await findBuildArtifact(bundleDir, candidate);
    if (found !== null) {
      installer = found;
      break;
    }
  }
  if (installer === null) {
    abort(`Could not find NSIS setup .exe under ${bundleDir}/nsis/`);
  }
  const signature = `${installer}.sig`;
  return { installer, signature };
}

async function resetReleaseDir() {
  await rm(RELEASE_DIR, { recursive: true, force: true });
  await mkdir(RELEASE_DIR, { recursive: true });
}

// Asset names carry the platform so both platforms coexist on one release.
async function stageMacosArtifacts(platform, artifacts) {
  await resetReleaseDir();
  const dmgOut = join(RELEASE_DIR, `${PRODUCT_NAME}-${platform}.dmg`);
  const tarballOut = join(RELEASE_DIR, `${PRODUCT_NAME}-${platform}.app.tar.gz`);
  const signatureOut = `${tarballOut}.sig`;
  await copyFile(artifacts.dmg, dmgOut);
  await copyFile(artifacts.tarball, tarballOut);
  await copyFile(artifacts.signature, signatureOut);
  return {
    uploads: [dmgOut, tarballOut, signatureOut],
    updaterPayload: tarballOut,
    signaturePath: signatureOut,
    summary: { dmg: dmgOut, tarball: tarballOut, signature: signatureOut },
  };
}

async function stageWindowsArtifacts(platform, artifacts) {
  await resetReleaseDir();
  const installerOut = join(RELEASE_DIR, `${PRODUCT_NAME}-${platform}-setup.exe`);
  const signatureOut = `${installerOut}.sig`;
  await copyFile(artifacts.installer, installerOut);
  await copyFile(artifacts.signature, signatureOut);
  // The same .exe is served both as the user download and as the updater
  // payload — Tauri 2 NSIS doesn't produce a separate updater archive.
  return {
    uploads: [installerOut, signatureOut],
    updaterPayload: installerOut,
    signaturePath: signatureOut,
    summary: { installer: installerOut, signature: signatureOut },
  };
}

function basename(path) {
  return path.split(/[/\\]/).pop();
}

async function readPublishedManifest(tag, existingAssets) {
  if (existingAssets === null || !existingAssets.includes(UPDATER_MANIFEST_NAME)) {
    return null;
  }
  const downloadDir = join(RELEASE_DIR, 'published');
  await mkdir(downloadDir, { recursive: true });
  await runCommand('gh', [
    'release',
    'download',
    tag,
    '--pattern',
    UPDATER_MANIFEST_NAME,
    '--dir',
    downloadDir,
    '--clobber',
  ]);
  const raw = await readFile(join(downloadDir, UPDATER_MANIFEST_NAME), 'utf-8');
  return JSON.parse(raw);
}

// One latest.json per release holds every platform: the first platform creates
// it, later platforms merge their entry into the published one and overwrite.
async function writeUpdaterManifest(context, staged) {
  const { version, tag, platform, repository, notes, existingAssets } = context;
  const { target, arch } = toTauriTarget(platform);
  const published = await readPublishedManifest(tag, existingAssets);
  const signature = (await readFile(staged.signaturePath, 'utf-8')).trim();
  const manifest = {
    version,
    notes,
    pub_date: new Date().toISOString(),
    platforms: {
      ...(published?.platforms ?? {}),
      [`${target}-${arch}`]: {
        signature,
        url: `https://github.com/${repository}/releases/download/${tag}/${basename(staged.updaterPayload)}`,
      },
    },
  };
  const manifestPath = join(RELEASE_DIR, UPDATER_MANIFEST_NAME);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
  return manifestPath;
}

async function confirmShip(context, staged, manifestPath) {
  info('');
  info('Release ready — final review.');
  info(`  Version:    ${context.version}`);
  info(`  Platform:   ${context.platform}`);
  info(`  Repository: ${context.repository}`);
  info(`  Staged:     ${RELEASE_DIR}`);
  for (const file of staged.uploads) {
    info(`    - ${file}`);
  }
  info(`    - ${manifestPath}`);
  info('');
  info('Install the artifact, smoke-test the app. Nothing is uploaded yet.');
  const confirmed = await promptConfirmation(
    `Type "yes" to publish to GitHub release ${context.tag}:`,
  );
  if (!confirmed) {
    abort('Aborted before upload. Artifacts kept in release/ for inspection.');
  }
}

async function publishToGitHub(context, staged, manifestPath, isForce) {
  const { tag, notes, existingAssets } = context;
  if (existingAssets === null) {
    const notesPath = join(RELEASE_DIR, 'notes.md');
    await writeFile(notesPath, `${notes}\n`, 'utf-8');
    info(`Creating release ${tag}...`);
    await runCommand('gh', ['release', 'create', tag, '--title', tag, '--notes-file', notesPath], {
      cwd: REPO_ROOT,
    });
  }

  info(`Uploading assets to release ${tag}...`);
  const uploadFlags = isForce ? ['--clobber'] : [];
  await runCommand('gh', ['release', 'upload', tag, ...staged.uploads, ...uploadFlags], {
    cwd: REPO_ROOT,
  });

  // The manifest is merged from the published one, so overwriting it is the
  // normal path for the second platform — never gated behind `force`.
  info(`Uploading ${UPDATER_MANIFEST_NAME}...`);
  await runCommand('gh', ['release', 'upload', tag, manifestPath, '--clobber'], {
    cwd: REPO_ROOT,
  });
}

function printSummary(context, staged) {
  const { version, tag, platform, repository } = context;
  success(`Released v${version} for ${platform}.`);
  for (const [label, path] of Object.entries(staged.summary)) {
    console.log(
      `  ${label}: https://github.com/${repository}/releases/download/${tag}/${basename(path)}`,
    );
  }
  console.log(
    `  manifest: https://github.com/${repository}/releases/latest/download/${UPDATER_MANIFEST_NAME}`,
  );
}

function expectedAssetNames(platform) {
  if (process.platform === 'darwin') {
    return [
      `${PRODUCT_NAME}-${platform}.dmg`,
      `${PRODUCT_NAME}-${platform}.app.tar.gz`,
      `${PRODUCT_NAME}-${platform}.app.tar.gz.sig`,
    ];
  }
  if (process.platform === 'win32') {
    return [`${PRODUCT_NAME}-${platform}-setup.exe`, `${PRODUCT_NAME}-${platform}-setup.exe.sig`];
  }
  abort(`Release on platform "${process.platform}" is not implemented yet.`);
}

async function main() {
  const { isForce, isNoConfirm } = parseArgs();
  const version = await readVersion();
  const platform = detectPlatform();
  const tag = `v${version}`;

  info(`Releasing ${tag} for ${platform}`);
  if (isForce) {
    warn('force enabled: existing release assets may be overwritten.');
  }
  if (isNoConfirm) {
    warn('no-confirm enabled: skipping ship confirmation prompt.');
  }

  info('Preflight: GitHub CLI...');
  await preflightGh();
  info('Preflight: release notes...');
  const notes = await readReleaseNotesSection(version);
  info('Preflight: working tree clean and pushed...');
  await preflightGitPushed();
  info('Preflight: assets not already published...');
  await preflightAssetsAvailable(tag, expectedAssetNames(platform), isForce);
  info('Preflight: signing credentials...');
  preflightSigning();
  info('Preflight: Tauri updater signing key...');
  preflightUpdaterKey();
  info('Preflight: core is staged...');
  await preflightCoreStaged();

  const repository = await readRepository();

  if (process.platform === 'darwin') {
    info('Signing core binaries...');
    await signCore();
  }

  // The core is signed in place before the copy: the signature is embedded in
  // each Mach-O file, so the copy carries it.
  const buildRoot = await prepareBuildRoot();
  const bundleDir = await buildTauri(buildRoot);

  let staged;
  if (process.platform === 'darwin') {
    const artifacts = await locateMacosArtifacts(bundleDir, version);
    staged = await stageMacosArtifacts(platform, artifacts);
  } else {
    const artifacts = await locateWindowsArtifacts(bundleDir, version);
    staged = await stageWindowsArtifacts(platform, artifacts);
  }
  await removeBuildRoot(buildRoot);

  // Re-read after the build: the probe before the build decided whether the
  // release exists, and nothing else publishes in between.
  const existingAssets = await readExistingAssets(tag);
  const context = { version, tag, platform, repository, notes, existingAssets };
  const manifestPath = await writeUpdaterManifest(context, staged);

  if (!isNoConfirm) {
    await confirmShip(context, staged, manifestPath);
  }

  await publishToGitHub(context, staged, manifestPath, isForce);
  printSummary(context, staged);
}

main().catch((caught) => {
  abort(caught instanceof Error ? caught.message : String(caught));
});
