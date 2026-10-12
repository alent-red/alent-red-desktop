#!/usr/bin/env node

import { mkdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { abort, info, success, warn } from './_lib/console.mjs';
import { coreReleaseAsset } from './_lib/core-release-asset.mjs';
import { downloadAndHash } from './_lib/download.mjs';
import { extractZip } from './_lib/extract-zip.mjs';
import { fetchPublishedSha256 } from './_lib/fetch-published-sha256.mjs';
import { readLockfile, writeLockfile } from './_lib/lockfile.mjs';
import { CORE_DESTINATION } from './_lib/paths.mjs';
import { detectPlatform } from './_lib/platform.mjs';

async function coreFolderExists() {
  try {
    const stats = await stat(CORE_DESTINATION);
    return stats.isDirectory();
  } catch (caught) {
    if (caught.code === 'ENOENT') {
      return false;
    }
    throw caught;
  }
}

async function main() {
  const skipIfPresent = process.argv.slice(2).includes('--skip-if-present');
  if (skipIfPresent && (await coreFolderExists())) {
    return;
  }

  const platform = detectPlatform();
  const lockfile = await readLockfile();
  if (lockfile === null) {
    abort('core.lock.json not found at repo root. Run `npm run core:update -- <version>` first.');
  }

  const { version } = lockfile;
  const expectedHash = lockfile.platforms[platform]?.sha256 ?? null;

  info(`Installing core v${version} for ${platform}`);
  if (expectedHash === null) {
    info('  no hash recorded — will be added after download');
  } else {
    info(`  expected sha256: ${expectedHash}`);
  }

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

  if (expectedHash !== null && computedHash !== expectedHash) {
    await rm(zipPath, { force: true });
    abort(
      `Hash mismatch for ${platform}:\n` +
        `  expected: ${expectedHash}\n` +
        `  computed: ${computedHash}\n` +
        'Release asset differs from core.lock.json — possible tampering or stale lockfile.',
    );
  }

  if (expectedHash === null) {
    lockfile.platforms[platform] = { sha256: computedHash };
    await writeLockfile(lockfile);
    warn(`  no hash recorded for '${platform}' in core.lock.json`);
    warn(`  added: ${computedHash}`);
    warn('  commit core.lock.json so other machines can verify against the same hash');
  }

  await rm(CORE_DESTINATION, { recursive: true, force: true });
  await mkdir(dirname(CORE_DESTINATION), { recursive: true });

  info(`  extracting to ${CORE_DESTINATION}`);
  await extractZip(zipPath, dirname(CORE_DESTINATION));
  await rm(zipPath, { force: true });

  const suffix = expectedHash === null ? ' (lockfile updated — commit core.lock.json)' : '';
  success(`Core v${version} installed for ${platform}${suffix}.`);
}

main().catch((caught) => {
  abort(caught instanceof Error ? caught.message : String(caught));
});
