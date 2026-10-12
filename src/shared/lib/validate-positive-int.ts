import { translate } from '@/shared/i18n/translate';

export function validatePositiveInt(value: number): string | null {
  if (!Number.isFinite(value)) {
    return translate('validation.mustBeNumber');
  }
  if (!Number.isInteger(value)) {
    return translate('validation.mustBeWhole');
  }
  if (value <= 0) {
    return translate('validation.mustBePositive');
  }
  return null;
}
