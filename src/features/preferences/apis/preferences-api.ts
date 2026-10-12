import type { Preference } from '@/features/preferences/types/preference';
import type { PreferenceInput } from '@/features/preferences/types/preference-input';
import { invoke } from '@/shared/invoke/invoke';

export const preferencesApi = {
  getAll: (): Promise<Preference[]> => invoke<Preference[]>('preferences_get_all'),
  saveMany: (preferences: PreferenceInput[]): Promise<Preference[]> =>
    invoke<Preference[]>('preferences_save_many', { preferences }),
};
