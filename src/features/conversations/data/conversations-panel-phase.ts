export const ConversationsPanelPhase = {
  ColdLoading: 'COLD_LOADING',
  WarmLoading: 'WARM_LOADING',
  Ready: 'READY',
  Error: 'ERROR',
} as const;
export type ConversationsPanelPhase =
  (typeof ConversationsPanelPhase)[keyof typeof ConversationsPanelPhase];
