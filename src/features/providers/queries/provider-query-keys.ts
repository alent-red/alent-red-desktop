export const providerQueryKeys = {
  list: ['providers'] as const,
  single: (id: string): readonly ['provider', string] => ['provider', id] as const,
};
