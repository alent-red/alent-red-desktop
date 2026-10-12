import { CORE_REPOSITORY, GITHUB_OWNER } from './paths.mjs';

export function coreReleaseAsset(version, platform) {
  const assetName = `${CORE_REPOSITORY}-${platform}.zip`;
  const baseUrl = `https://github.com/${GITHUB_OWNER}/${CORE_REPOSITORY}/releases/download/v${version}`;
  return {
    assetName,
    zipUrl: `${baseUrl}/${assetName}`,
    sha256Url: `${baseUrl}/${assetName}.sha256`,
  };
}
