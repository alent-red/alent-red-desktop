import { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import type { TranslationKey } from '@/shared/i18n/translate';

export const PROVIDER_KIND_LABEL_KEY: Record<ProviderConfigType, TranslationKey> = {
  [ProviderConfigType.Anthropic]: 'providers.kindLabelAnthropic',
  [ProviderConfigType.Openai]: 'providers.kindLabelOpenai',
  [ProviderConfigType.LmStudio]: 'providers.kindLabelLmStudio',
  [ProviderConfigType.Custom]: 'providers.kindLabelCustom',
};
