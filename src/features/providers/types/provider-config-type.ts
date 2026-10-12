export const ProviderConfigType = {
  Anthropic: 'ANTHROPIC',
  Openai: 'OPENAI',
  LmStudio: 'LM_STUDIO',
  Custom: 'CUSTOM',
} as const;
export type ProviderConfigType = (typeof ProviderConfigType)[keyof typeof ProviderConfigType];
