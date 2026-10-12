import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { abort } from './console.mjs';
import { REPO_ROOT } from './paths.mjs';

const RELEASE_NOTES_PATH = join(REPO_ROOT, 'RELEASE_NOTES.md');

// Returns the body of the "## {version}" section, up to the next "## " heading.
// Refuses to continue when the section is missing or empty: writing the notes
// is part of releasing.
export async function readReleaseNotesSection(version) {
  const content = await readFile(RELEASE_NOTES_PATH, 'utf-8');
  const lines = content.split('\n');
  const collected = [];
  let isInSection = false;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      isInSection = line.slice(3).trim() === version;
      continue;
    }
    if (isInSection) {
      collected.push(line);
    }
  }
  const notes = collected.join('\n').trim();
  if (notes.length === 0) {
    abort(
      `No release notes for ${version} in RELEASE_NOTES.md.\n` +
        `Add a "## ${version}" section with the changes before releasing.`,
    );
  }
  return notes;
}
