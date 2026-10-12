export const BufferedConversationEventType = {
  Save: 'SAVE',
  Delete: 'DELETE',
} as const;
export type BufferedConversationEventType =
  (typeof BufferedConversationEventType)[keyof typeof BufferedConversationEventType];
