import type { Preference } from '@/features/preferences/types/preference';
import type { PreferenceKey } from '@/features/preferences/types/preference-key';
import { PreferenceValueType } from '@/features/preferences/types/preference-value-type';
import { AnthropicCacheTtl } from '@/features/providers/types/anthropic-cache-ttl';

const WIRE_DEFAULT = 'default';
const WIRE_5_MINUTES = '5m';
const WIRE_1_HOUR = '1h';

export function readCacheTtlPreference(
  preferences: Preference[],
  key: PreferenceKey,
  fallback: AnthropicCacheTtl,
): AnthropicCacheTtl {
  const entry = preferences.find((preference): boolean => preference.key === key);
  if (entry?.value.type !== PreferenceValueType.String) {
    return fallback;
  }
  const stored = entry.value.value;
  if (stored === WIRE_5_MINUTES) {
    return AnthropicCacheTtl.Min5;
  }
  if (stored === WIRE_1_HOUR) {
    return AnthropicCacheTtl.Hour1;
  }
  if (stored === WIRE_DEFAULT) {
    return AnthropicCacheTtl.Default;
  }
  return fallback;
}
