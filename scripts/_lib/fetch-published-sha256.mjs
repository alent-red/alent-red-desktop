import { abort } from './console.mjs';

const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/;

// The sidecar is written by the core release command as "<sha256>  <asset>".
export async function fetchPublishedSha256(url) {
  const response = await fetch(url);
  if (!response.ok) {
    abort(`Could not fetch the sha256 sidecar: HTTP ${String(response.status)} for ${url}`);
  }
  const text = await response.text();
  const [hash] = text.trim().split(/\s+/);
  if (hash === undefined || !SHA256_HEX_PATTERN.test(hash)) {
    abort(`Malformed sha256 sidecar at ${url}: "${text.trim()}"`);
  }
  return hash;
}
