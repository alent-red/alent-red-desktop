import { translate } from '@/shared/i18n/translate';

// Pattern mirrors the core's `_TELEGRAM_USERNAME_PATTERN`. The form is
// expected to canonicalize (strip `@`, lowercase, trim) before validating.
const TELEGRAM_USERNAME_PATTERN = /^[a-z0-9_]{5,32}$/;

export function validateTelegramUsername(canonical: string): string | null {
  if (canonical.length === 0) {
    return translate('gateways.allowedUserNameRequired');
  }
  if (!TELEGRAM_USERNAME_PATTERN.test(canonical)) {
    return translate('gateways.allowedUserNameInvalid');
  }
  return null;
}
