import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';

export function validateHttpUrl(value: string): string | null {
  const trimmed = trimSpaces(value);
  if (trimmed.length === 0) {
    return translate('validation.required');
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return translate('validation.mustBeUrl');
    }
    return null;
  } catch {
    return translate('validation.mustBeUrl');
  }
}
