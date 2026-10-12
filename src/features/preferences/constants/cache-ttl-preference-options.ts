import type { TranslationKey } from '@/shared/i18n/translate';

interface CacheTtlPreferenceOption {
  value: string;
  labelKey: TranslationKey;
}

export const CACHE_TTL_PREFERENCE_OPTIONS: CacheTtlPreferenceOption[] = [
  { value: 'default', labelKey: 'preferences.cacheTtlDefault' },
  { value: '5m', labelKey: 'preferences.cacheTtlMin5' },
  { value: '1h', labelKey: 'preferences.cacheTtlHour1' },
];
