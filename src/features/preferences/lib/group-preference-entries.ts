export function groupPreferenceEntries<TItem>(
  items: TItem[],
  computeKey: (item: TItem) => string,
): Record<string, TItem[]> {
  const result: Record<string, TItem[]> = {};
  for (const item of items) {
    const key = computeKey(item);
    result[key] ??= [];
    result[key].push(item);
  }
  return result;
}
