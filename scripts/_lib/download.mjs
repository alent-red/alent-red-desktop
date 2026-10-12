import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';

import { abort } from './console.mjs';

export async function downloadAndHash(url, destinationPath) {
  const response = await fetch(url);
  if (response.status === 404) {
    abort(`Not found at ${url} (HTTP 404). Check the version and platform are published.`);
  }
  if (!response.ok) {
    abort(`Download failed: HTTP ${response.status} for ${url}`);
  }
  if (response.body === null) {
    abort(`Download failed: empty response body for ${url}`);
  }

  const totalBytes = Number(response.headers.get('content-length') ?? 0);
  const hasher = createHash('sha256');
  const fileStream = createWriteStream(destinationPath);

  let received = 0;
  let lastReportedPercent = -1;

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    hasher.update(value);
    received += value.byteLength;
    if (totalBytes > 0) {
      const percent = Math.floor((received / totalBytes) * 100);
      if (percent !== lastReportedPercent && percent % 5 === 0) {
        process.stdout.write(`\r  downloading... ${percent}%`);
        lastReportedPercent = percent;
      }
    }
    if (!fileStream.write(value)) {
      await new Promise((resolveWrite) => fileStream.once('drain', resolveWrite));
    }
  }

  await new Promise((resolveEnd, rejectEnd) => {
    fileStream.end((caught) => (caught ? rejectEnd(caught) : resolveEnd()));
  });

  process.stdout.write('\r  downloading... 100%\n');
  return hasher.digest('hex');
}
