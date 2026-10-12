import { PreferenceKey } from '@/features/preferences/types/preference-key';

export const CACHE_TTL_PREFERENCE_KEYS: ReadonlySet<PreferenceKey> = new Set([
  PreferenceKey.AnthropicCacheMediumTtl,
  PreferenceKey.AnthropicCacheHighTtl,
]);
