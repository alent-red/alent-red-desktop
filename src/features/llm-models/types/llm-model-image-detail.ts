export const LlmModelImageDetail = {
  Default: 'DEFAULT',
  Low: 'LOW',
  High: 'HIGH',
} as const;
export type LlmModelImageDetail = (typeof LlmModelImageDetail)[keyof typeof LlmModelImageDetail];
