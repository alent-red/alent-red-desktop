export function avatarColorVariable(colorIndex: number): string {
  return `var(--avatar-${String(colorIndex)})`;
}
