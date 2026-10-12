import { readFile, writeFile } from 'node:fs/promises';

import { abort } from './console.mjs';
import { LOCKFILE_PATH } from './paths.mjs';

export async function readLockfile() {
  let raw;
  try {
    raw = await readFile(LOCKFILE_PATH, 'utf-8');
  } catch (caught) {
    if (caught.code === 'ENOENT') {
      return null;
    }
    abort(`Failed to read core.lock.json: ${caught.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (caught) {
    abort(`core.lock.json is not valid JSON: ${caught.message}`);
  }
  if (typeof parsed.version !== 'string' || parsed.version.length === 0) {
    abort('core.lock.json has no version set.');
  }
  if (parsed.platforms === null || typeof parsed.platforms !== 'object') {
    abort('core.lock.json is missing the "platforms" object.');
  }
  return parsed;
}

export async function writeLockfile(lockfile) {
  const serialized = `${JSON.stringify(lockfile, null, 2)}\n`;
  await writeFile(LOCKFILE_PATH, serialized, 'utf-8');
}
