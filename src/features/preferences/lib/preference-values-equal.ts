import type { PreferenceValue } from '@/features/preferences/types/preference-value';

export function preferenceValuesEqual(left: PreferenceValue, right: PreferenceValue): boolean {
  if (left.type !== right.type) {
    return false;
  }
  return left.value === right.value;
}
