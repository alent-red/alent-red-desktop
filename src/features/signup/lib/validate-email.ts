import { translate } from '@/shared/i18n/translate';

// Cheap structural check — enough to catch typos at form-fill time.
// Real-world validity is confirmed when we (eventually) send mail; an RFC-strict
// regex over-rejects valid addresses without adding meaningful protection.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return translate('signup.errorEmailRequired');
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return translate('signup.errorEmailInvalid');
  }
  return null;
}
