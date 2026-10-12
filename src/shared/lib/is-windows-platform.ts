// macOS / Windows / Linux detection from the webview's user-agent string.
// Used to apply Windows-only window adjustments — borderless decorations,
// caption-controls safe area, etc. — without touching the Mac code paths.
export function isWindowsPlatform(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return /windows/i.test(navigator.userAgent);
}
