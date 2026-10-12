export const brickQueryKeys = {
  all: ['bricks'] as const,
  list: (agentId: string | null): readonly ['bricks', string | null] =>
    ['bricks', agentId] as const,
  single: (id: string): readonly ['brick', string] => ['brick', id] as const,
};
