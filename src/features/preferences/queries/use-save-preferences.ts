import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { preferencesApi } from '@/features/preferences/apis/preferences-api';
import { preferenceQueryKeys } from '@/features/preferences/queries/preference-query-keys';
import type { Preference } from '@/features/preferences/types/preference';
import type { PreferenceInput } from '@/features/preferences/types/preference-input';

export function useSavePreferences(): UseMutationResult<
  Preference[],
  DefaultError,
  PreferenceInput[]
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferences: PreferenceInput[]): Promise<Preference[]> =>
      preferencesApi.saveMany(preferences),
    onSuccess: (): void => {
      void queryClient.invalidateQueries({ queryKey: preferenceQueryKeys.list });
    },
  });
}
