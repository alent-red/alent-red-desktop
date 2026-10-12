import type { Preference } from '@/features/preferences/types/preference';
import type { PreferenceKey } from '@/features/preferences/types/preference-key';
import { PreferenceValueType } from '@/features/preferences/types/preference-value-type';

export function readIntPreference(
  preferences: Preference[],
  key: PreferenceKey,
  fallback: number,
): number {
  const entry = preferences.find((preference): boolean => preference.key === key);
  if (entry?.value.type === PreferenceValueType.Int) {
    return entry.value.value;
  }
  return fallback;
}
