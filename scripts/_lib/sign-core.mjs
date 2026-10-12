import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { abort, info } from './console.mjs';
import { CORE_DESTINATION } from './paths.mjs';
import { captureCommand, runCommand } from './run-command.mjs';

async function walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkFiles(fullPath)));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

async function isMachO(path) {
  const result = await captureCommand('file', ['--brief', path]);
  if (result.code !== 0) {
    return false;
  }
  return result.stdout.includes('Mach-O');
}

async function signOne(path, identity) {
  await runCommand('codesign', [
    '--force',
    '--options',
    'runtime',
    '--timestamp',
    '--sign',
    identity,
    path,
  ]);
}

export async function signCore() {
  if (process.platform !== 'darwin') {
    info('  not macOS — skipping core code-signing');
    return;
  }
  const identity = process.env.APPLE_SIGNING_IDENTITY;
  if (identity === undefined || identity.length === 0) {
    abort('APPLE_SIGNING_IDENTITY is required to sign core binaries.');
  }

  info(`Signing core binaries in ${CORE_DESTINATION}`);
  const allFiles = await walkFiles(CORE_DESTINATION);

  const machOFiles = [];
  for (const path of allFiles) {
    if (await isMachO(path)) {
      machOFiles.push(path);
    }
  }
  info(`  found ${String(machOFiles.length)} Mach-O files`);

  for (const path of machOFiles) {
    await signOne(path, identity);
  }
  info(
    `  signed ${String(machOFiles.length)} files with Developer ID + hardened runtime + timestamp`,
  );
}
