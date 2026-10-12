import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { gatewaysApi } from '@/features/gateways/apis/gateways-api';
import { gatewayQueryKeys } from '@/features/gateways/queries/gateway-query-keys';
import type { Gateway } from '@/features/gateways/types/gateway';
import { compareNamesNaturally } from '@/shared/lib/compare-names-naturally';

export function useGateways(agentId: string | null): UseQueryResult<Gateway[]> {
  return useQuery({
    queryKey: gatewayQueryKeys.list(agentId),
    queryFn: async (): Promise<Gateway[]> => {
      const list = await gatewaysApi.getAll(agentId);
      return [...list].sort((left, right): number => compareNamesNaturally(left.name, right.name));
    },
  });
}
