export const ProviderApiFormatType = {
  Anthropic: 'ANTHROPIC',
  OpenaiChatCompletions: 'OPENAI_CHAT_COMPLETIONS',
  OpenaiResponses: 'OPENAI_RESPONSES',
} as const;
export type ProviderApiFormatType =
  (typeof ProviderApiFormatType)[keyof typeof ProviderApiFormatType];
