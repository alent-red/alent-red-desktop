const TAURI_TARGETS = {
  'macos-arm64': { target: 'darwin', arch: 'aarch64' },
  'macos-x86_64': { target: 'darwin', arch: 'x86_64' },
  'linux-arm64': { target: 'linux', arch: 'aarch64' },
  'linux-x86_64': { target: 'linux', arch: 'x86_64' },
  'windows-arm64': { target: 'windows', arch: 'aarch64' },
  'windows-x86_64': { target: 'windows', arch: 'x86_64' },
};

export function toTauriTarget(platform) {
  const mapping = TAURI_TARGETS[platform];
  if (mapping === undefined) {
    throw new Error(`No Tauri target mapping for platform: ${platform}`);
  }
  return mapping;
}
