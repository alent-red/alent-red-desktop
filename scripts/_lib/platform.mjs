import { abort } from './console.mjs';

const ARCH_MAP = { arm64: 'arm64', x64: 'x86_64' };
const PLATFORM_MAP = { darwin: 'macos', linux: 'linux', win32: 'windows' };

export function detectPlatform() {
  const { platform, arch } = process;
  const mappedArch = ARCH_MAP[arch];
  const mappedPlatform = PLATFORM_MAP[platform];
  if (mappedArch === undefined || mappedPlatform === undefined) {
    abort(`Unsupported platform: ${platform}/${arch}`);
  }
  return `${mappedPlatform}-${mappedArch}`;
}
