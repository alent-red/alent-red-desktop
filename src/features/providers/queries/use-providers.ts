import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { providersApi } from '@/features/providers/apis/providers-api';
import { providerQueryKeys } from '@/features/providers/queries/provider-query-keys';
import type { Provider } from '@/features/providers/types/provider';
import { compareNamesNaturally } from '@/shared/lib/compare-names-naturally';

export function useProviders(): UseQueryResult<Provider[]> {
  return useQuery({
    queryKey: providerQueryKeys.list,
    queryFn: async (): Promise<Provider[]> => {
      const list = await providersApi.getAll();
      return [...list].sort((left, right): number => compareNamesNaturally(left.name, right.name));
    },
  });
}
