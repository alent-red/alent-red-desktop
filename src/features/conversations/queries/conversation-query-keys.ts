export const conversationQueryKeys = {
  list: (agentId: string | null): readonly ['conversations', string | null] =>
    ['conversations', agentId] as const,
  single: (id: string): readonly ['conversation', string] => ['conversation', id] as const,
};
