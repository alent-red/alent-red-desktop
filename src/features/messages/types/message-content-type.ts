export const MessageContentType = {
  Internal: 'INTERNAL',
  User: 'USER',
  Ai: 'AI',
  Tool: 'TOOL',
} as const;
export type MessageContentType = (typeof MessageContentType)[keyof typeof MessageContentType];
