import type { AnthropicCacheTtl } from '@/features/providers/types/anthropic-cache-ttl';
import type { ProviderApiFormat } from '@/features/providers/types/provider-api-format';
import { ProviderApiFormatType } from '@/features/providers/types/provider-api-format-type';
import { assertNever } from '@/shared/lib/assert-never';

export interface AnthropicProviderApiFormatInputs {
  reasoningMinimalBudgetTokens: number;
  reasoningLowBudgetTokens: number;
  reasoningMediumBudgetTokens: number;
  reasoningHighBudgetTokens: number;
  reasoningXhighBudgetTokens: number;
  cacheMediumTtl: AnthropicCacheTtl;
  cacheHighTtl: AnthropicCacheTtl;
}

export function buildProviderApiFormat(
  format: ProviderApiFormatType,
  anthropicInputs: AnthropicProviderApiFormatInputs,
): ProviderApiFormat {
  switch (format) {
    case ProviderApiFormatType.Anthropic:
      return {
        type: ProviderApiFormatType.Anthropic,
        reasoningMinimalBudgetTokens: anthropicInputs.reasoningMinimalBudgetTokens,
        reasoningLowBudgetTokens: anthropicInputs.reasoningLowBudgetTokens,
        reasoningMediumBudgetTokens: anthropicInputs.reasoningMediumBudgetTokens,
        reasoningHighBudgetTokens: anthropicInputs.reasoningHighBudgetTokens,
        reasoningXhighBudgetTokens: anthropicInputs.reasoningXhighBudgetTokens,
        cacheMediumTtl: anthropicInputs.cacheMediumTtl,
        cacheHighTtl: anthropicInputs.cacheHighTtl,
      };
    case ProviderApiFormatType.OpenaiChatCompletions:
      return { type: ProviderApiFormatType.OpenaiChatCompletions };
    case ProviderApiFormatType.OpenaiResponses:
      return { type: ProviderApiFormatType.OpenaiResponses };
    default:
      return assertNever(format);
  }
}
