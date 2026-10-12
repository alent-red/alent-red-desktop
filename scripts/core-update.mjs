#!/usr/bin/env node

import { mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { abort, info, success } from './_lib/console.mjs';
import { coreReleaseAsset } from './_lib/core-release-asset.mjs';
import { downloadAndHash } from './_lib/download.mjs';
import { extractZip } from './_lib/extract-zip.mjs';
import { fetchPublishedSha256 } from './_lib/fetch-published-sha256.mjs';
import { writeLockfile } from './_lib/lockfile.mjs';
import { CORE_DESTINATION } from './_lib/paths.mjs';
import { detectPlatform } from './_lib/platform.mjs';

const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

function parseArgs() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    abort('Usage: npm run core:update -- <version>   (e.g. 0.1.0)');
  }
  const version = argv[0];
  if (!SEMVER_PATTERN.test(version)) {
    abort(`Version must be numeric semver (e.g. 0.1.0). Got: ${version}`);
  }
  return { version };
}

async function main() {
  const { version } = parseArgs();
  const platform = detectPlatform();

  info(`Updating core to v${version} for ${platform}`);

  const nextLockfile = { version, platforms: {} };

  const { assetName, zipUrl, sha256Url } = coreReleaseAsset(version, platform);
  const zipPath = join(
    tmpdir(),
    `${assetName.slice(0, -4)}-v${version}-${String(process.pid)}.zip`,
  );

  info(`  fetching ${zipUrl}`);
  const computedHash = await downloadAndHash(zipUrl, zipPath);
  info(`  computed sha256: ${computedHash}`);

  const publishedHash = await fetchPublishedSha256(sha256Url);
  if (computedHash !== publishedHash) {
    await rm(zipPath, { force: true });
    abort(
      `Hash mismatch against the published sidecar for ${platform}:\n` +
        `  published: ${publishedHash}\n` +
        `  computed:  ${computedHash}\n` +
        'The downloaded asset does not match its release — corrupted download or tampering.',
    );
  }

  nextLockfile.platforms[platform] = { sha256: computedHash };
  await writeLockfile(nextLockfile);

  await rm(CORE_DESTINATION, { recursive: true, force: true });
  await mkdir(dirname(CORE_DESTINATION), { recursive: true });

  info(`  extracting to ${CORE_DESTINATION}`);
  await extractZip(zipPath, dirname(CORE_DESTINATION));
  await rm(zipPath, { force: true });

  success(`Core updated to v${version} for ${platform}.`);
}

main().catch((caught) => {
  abort(caught instanceof Error ? caught.message : String(caught));
});
