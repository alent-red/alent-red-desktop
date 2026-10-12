export const blobQueryKeys = {
  single: (key: string): readonly ['blob', string] => ['blob', key] as const,
};
