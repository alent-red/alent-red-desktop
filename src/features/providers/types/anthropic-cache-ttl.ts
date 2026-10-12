export const AnthropicCacheTtl = {
  Default: 'DEFAULT',
  Min5: 'MIN5',
  Hour1: 'HOUR1',
} as const;
export type AnthropicCacheTtl = (typeof AnthropicCacheTtl)[keyof typeof AnthropicCacheTtl];
