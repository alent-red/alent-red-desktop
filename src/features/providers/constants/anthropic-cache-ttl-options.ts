import { AnthropicCacheTtl } from '@/features/providers/types/anthropic-cache-ttl';
import type { TranslationKey } from '@/shared/i18n/translate';

interface AnthropicCacheTtlOption {
  value: AnthropicCacheTtl;
  labelKey: TranslationKey;
}

export const ANTHROPIC_CACHE_TTL_OPTIONS: AnthropicCacheTtlOption[] = [
  { value: AnthropicCacheTtl.Default, labelKey: 'providers.cacheTtlDefault' },
  { value: AnthropicCacheTtl.Min5, labelKey: 'providers.cacheTtlMin5' },
  { value: AnthropicCacheTtl.Hour1, labelKey: 'providers.cacheTtlHour1' },
];
