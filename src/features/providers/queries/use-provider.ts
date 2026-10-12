import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { providersApi } from '@/features/providers/apis/providers-api';
import { providerQueryKeys } from '@/features/providers/queries/provider-query-keys';
import type { Provider } from '@/features/providers/types/provider';

export function useProvider(id: string | null | undefined): UseQueryResult<Provider | null> {
  const isEnabled = id !== null && id !== undefined && id !== '';
  return useQuery({
    queryKey: isEnabled ? providerQueryKeys.single(id) : ['provider', null],
    queryFn: (): Promise<Provider | null> =>
      isEnabled ? providersApi.get(id) : Promise.resolve(null),
    enabled: isEnabled,
  });
}
