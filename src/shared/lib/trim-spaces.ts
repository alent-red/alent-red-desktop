// Strip leading/trailing SPACES only (never newlines or tabs).
// Matches the core's `v.strip(" ")` — multi-line content is preserved as-is.
export function trimSpaces(value: string): string {
  return value.replace(/^ +| +$/g, '');
}
