export const AgentVerbosity = {
  Default: 'DEFAULT',
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
} as const;
export type AgentVerbosity = (typeof AgentVerbosity)[keyof typeof AgentVerbosity];
