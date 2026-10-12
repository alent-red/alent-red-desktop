// Absolute paths an agent typically writes: macOS and Linux roots, the home
// shorthand, and Windows drive letters. Relative paths are deliberately not
// matched because they cannot be opened without a working directory.
const LOCAL_PATH_START_PATTERN =
  /^(?:~\/|\/(?:Users|home|tmp|private|var|etc|opt|Applications|Volumes|Library|usr)\/|[A-Za-z]:\\)/;

// Whole-span values (inline code) may contain spaces; prose detection cannot.
export function isLocalPath(value: string): boolean {
  return LOCAL_PATH_START_PATTERN.test(value) && !/[\n\r\t]/.test(value);
}
