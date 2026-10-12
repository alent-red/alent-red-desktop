import { translate } from '@/shared/i18n/translate';

export function validateProbability(value: number): string | null {
  if (!Number.isFinite(value)) {
    return translate('validation.mustBeNumber');
  }
  if (value < 0) {
    return translate('validation.mustBeAtLeastZero');
  }
  if (value > 1) {
    return translate('validation.mustBeAtMostOne');
  }
  return null;
}
