export const BufferedMessageEventType = {
  Save: 'SAVE',
  DeleteAfter: 'DELETE_AFTER',
} as const;
export type BufferedMessageEventType =
  (typeof BufferedMessageEventType)[keyof typeof BufferedMessageEventType];
