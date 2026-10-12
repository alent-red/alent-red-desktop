import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';

export function validateTrimmedNonEmpty(value: string, label?: string): string | null {
  if (trimSpaces(value).length === 0) {
    return label ?? translate('validation.required');
  }
  return null;
}
