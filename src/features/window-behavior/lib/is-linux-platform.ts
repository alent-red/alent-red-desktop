// macOS / Windows / Linux detection from the webview's user-agent string.
// Used to disable content-protection (no equivalent on X11/Wayland).
export function isLinuxPlatform(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return /linux/i.test(navigator.userAgent);
}
