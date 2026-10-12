export const ConversationLivePhase = {
  ColdLoading: 'COLD_LOADING',
  WarmLoading: 'WARM_LOADING',
  Ready: 'READY',
  Error: 'ERROR',
} as const;
export type ConversationLivePhase =
  (typeof ConversationLivePhase)[keyof typeof ConversationLivePhase];
