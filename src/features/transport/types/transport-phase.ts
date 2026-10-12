export const TransportPhase = {
  Idle: 'IDLE',
  Connecting: 'CONNECTING',
  Connected: 'CONNECTED',
  Failed: 'FAILED',
} as const;
export type TransportPhase = (typeof TransportPhase)[keyof typeof TransportPhase];
