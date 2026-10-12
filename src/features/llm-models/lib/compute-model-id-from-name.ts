export function computeModelIdFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s.]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
