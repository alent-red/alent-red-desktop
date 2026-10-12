export const LlmModelCache = {
  Default: 'DEFAULT',
  Medium: 'MEDIUM',
  High: 'HIGH',
} as const;
export type LlmModelCache = (typeof LlmModelCache)[keyof typeof LlmModelCache];
