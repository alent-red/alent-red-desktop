import type { PreferenceKey } from '@/features/preferences/types/preference-key';
import type { PreferenceValue } from '@/features/preferences/types/preference-value';

export interface PreferenceInput {
  key: PreferenceKey;
  value: PreferenceValue;
}
