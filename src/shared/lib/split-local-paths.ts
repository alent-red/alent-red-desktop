export interface LocalPathSegment {
  isPath: boolean;
  value: string;
}

const LOCAL_PATH_PATTERN =
  /(?<![\w/\\])(?:~\/|\/(?:Users|home|tmp|private|var|etc|opt|Applications|Volumes|Library|usr)\/|[A-Za-z]:\\)[^\s"'<>()[\]]*/g;
const TRAILING_PUNCTUATION_PATTERN = /[.,;:!?]+$/;

// Splits free text into plain segments and absolute local paths, trimming the
// sentence punctuation that follows a path.
export function splitLocalPaths(text: string): LocalPathSegment[] {
  const segments: LocalPathSegment[] = [];
  let cursor = 0;
  for (const match of text.matchAll(LOCAL_PATH_PATTERN)) {
    const start = match.index;
    const raw = match[0];
    const path = raw.replace(TRAILING_PUNCTUATION_PATTERN, '');
    if (path.length <= 1) {
      continue;
    }
    if (start > cursor) {
      segments.push({ isPath: false, value: text.slice(cursor, start) });
    }
    segments.push({ isPath: true, value: path });
    cursor = start + path.length;
  }
  if (cursor < text.length) {
    segments.push({ isPath: false, value: text.slice(cursor) });
  }
  return segments;
}
