import { canonicalizeTelegramUsername } from '@/features/gateways/lib/canonicalize-telegram-username';
import type { AllowedUserNameEntry } from '@/features/gateways/views/gateway-allowed-user-names-list';

export function canonicalizeAllowedUserNameEntries(entries: AllowedUserNameEntry[]): string[] {
  return entries
    .map((entry): string => canonicalizeTelegramUsername(entry.value))
    .filter((canonical): boolean => canonical.length > 0);
}
