export const agentQueryKeys = {
  list: ['agents'] as const,
  single: (id: string): readonly ['agent', string] => ['agent', id] as const,
};
