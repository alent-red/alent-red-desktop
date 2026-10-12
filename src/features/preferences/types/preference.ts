import type { PreferenceKey } from '@/features/preferences/types/preference-key';
import type { PreferenceValue } from '@/features/preferences/types/preference-value';

export interface Preference {
  id: string;
  createdAt: string;
  updatedAt: string;
  key: PreferenceKey;
  value: PreferenceValue;
}
