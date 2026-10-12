export const MessagesPanelPhase = {
  ColdLoading: 'COLD_LOADING',
  WarmLoading: 'WARM_LOADING',
  Ready: 'READY',
  Error: 'ERROR',
} as const;
export type MessagesPanelPhase = (typeof MessagesPanelPhase)[keyof typeof MessagesPanelPhase];
