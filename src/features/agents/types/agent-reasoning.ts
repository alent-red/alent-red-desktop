export const AgentReasoning = {
  Default: 'DEFAULT',
  Minimal: 'MINIMAL',
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
  Xhigh: 'XHIGH',
} as const;
export type AgentReasoning = (typeof AgentReasoning)[keyof typeof AgentReasoning];
