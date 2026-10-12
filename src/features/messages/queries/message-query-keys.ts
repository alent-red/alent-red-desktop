export const messageQueryKeys = {
  list: (conversationId: string): readonly ['messages', string] =>
    ['messages', conversationId] as const,
};
