import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { preferencesApi } from '@/features/preferences/apis/preferences-api';
import { preferenceQueryKeys } from '@/features/preferences/queries/preference-query-keys';
import type { Preference } from '@/features/preferences/types/preference';

export function usePreferences(): UseQueryResult<Preference[]> {
  return useQuery({
    queryKey: preferenceQueryKeys.list,
    queryFn: (): Promise<Preference[]> => preferencesApi.getAll(),
  });
}
