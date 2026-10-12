const AVATAR_COLOR_INDEX_COUNT = 12;

export function computeAvatarColorIndex(name: string): number {
  const normalized = name.replace(/\./g, ' ');
  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(index);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  return (positive % AVATAR_COLOR_INDEX_COUNT) + 1;
}
