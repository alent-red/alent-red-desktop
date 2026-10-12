import { ProviderApiFormatType } from '@/features/providers/types/provider-api-format-type';
import type { TranslationKey } from '@/shared/i18n/translate';

interface ProviderApiFormatOption {
  value: ProviderApiFormatType;
  labelKey: TranslationKey;
}

export const PROVIDER_API_FORMAT_OPTIONS: ProviderApiFormatOption[] = [
  { value: ProviderApiFormatType.Anthropic, labelKey: 'providers.apiFormatAnthropic' },
  {
    value: ProviderApiFormatType.OpenaiChatCompletions,
    labelKey: 'providers.apiFormatOpenaiChatCompletions',
  },
  {
    value: ProviderApiFormatType.OpenaiResponses,
    labelKey: 'providers.apiFormatOpenaiResponses',
  },
];
