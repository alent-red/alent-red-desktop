import type { AnthropicCacheTtl } from '@/features/providers/types/anthropic-cache-ttl';
import { type ProviderApiFormatType } from '@/features/providers/types/provider-api-format-type';

export type ProviderApiFormat =
  | {
      type: typeof ProviderApiFormatType.Anthropic;
      reasoningMinimalBudgetTokens: number;
      reasoningLowBudgetTokens: number;
      reasoningMediumBudgetTokens: number;
      reasoningHighBudgetTokens: number;
      reasoningXhighBudgetTokens: number;
      cacheMediumTtl: AnthropicCacheTtl;
      cacheHighTtl: AnthropicCacheTtl;
    }
  | { type: typeof ProviderApiFormatType.OpenaiChatCompletions }
  | { type: typeof ProviderApiFormatType.OpenaiResponses };
