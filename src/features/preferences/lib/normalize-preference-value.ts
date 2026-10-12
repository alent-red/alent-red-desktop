import type { PreferenceValue } from '@/features/preferences/types/preference-value';
import { PreferenceValueType } from '@/features/preferences/types/preference-value-type';
import { trimSpaces } from '@/shared/lib/trim-spaces';

export function normalizePreferenceValue(value: PreferenceValue): PreferenceValue {
  if (value.type === PreferenceValueType.String) {
    return { type: PreferenceValueType.String, value: trimSpaces(value.value) };
  }
  return value;
}
