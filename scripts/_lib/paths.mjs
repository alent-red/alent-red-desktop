import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const LOCKFILE_PATH = join(REPO_ROOT, 'core.lock.json');
export const CORE_DESTINATION = join(REPO_ROOT, 'src-tauri', 'resources', 'core', 'alent-red-core');
export const GITHUB_OWNER = 'alent-red';
export const CORE_REPOSITORY = 'alent-red-core';
