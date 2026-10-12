import type { AllowedUserNameEntry } from '@/features/gateways/views/gateway-allowed-user-names-list';

export function buildEmptyAllowedUserNameEntry(seed: number): AllowedUserNameEntry {
  return {
    id: `allowed-${String(seed)}`,
    value: '',
    error: null,
    isTouched: false,
  };
}
