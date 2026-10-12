import type { PreferenceValue } from '@/features/preferences/types/preference-value';
import { PreferenceValueType } from '@/features/preferences/types/preference-value-type';
import { translate } from '@/shared/i18n/translate';
import { validateTrimmedNonEmpty } from '@/shared/lib/validate-trimmed-non-empty';

export function validatePreferenceValue(value: PreferenceValue | undefined): string | null {
  if (value === undefined) {
    return null;
  }
  if (value.type === PreferenceValueType.String) {
    return validateTrimmedNonEmpty(value.value);
  }
  if (value.type === PreferenceValueType.Int || value.type === PreferenceValueType.Float) {
    if (!Number.isFinite(value.value)) {
      return translate('validation.mustBeNumber');
    }
  }
  return null;
}
