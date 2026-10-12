export function computeNameFromModelId(modelId: string): string {
  const dotted = modelId.replace(/(?<=\d)[-_](?=\d)/g, '.');
  const spaced = dotted.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return spaced
    .split(' ')
    .map((word): string => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}
