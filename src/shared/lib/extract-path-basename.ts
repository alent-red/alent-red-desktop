const PATH_SEPARATOR_PATTERN = /[/\\]/;

export function extractPathBasename(path: string): string {
  if (path.length === 0) {
    return '';
  }
  const segments = path.split(PATH_SEPARATOR_PATTERN).filter(Boolean);
  return segments[segments.length - 1] ?? path;
}
