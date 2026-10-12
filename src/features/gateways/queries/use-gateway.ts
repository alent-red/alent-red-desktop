import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { gatewaysApi } from '@/features/gateways/apis/gateways-api';
import { gatewayQueryKeys } from '@/features/gateways/queries/gateway-query-keys';
import type { Gateway } from '@/features/gateways/types/gateway';

export function useGateway(id: string | null | undefined): UseQueryResult<Gateway | null> {
  const isEnabled = id !== null && id !== undefined && id !== '';
  return useQuery({
    queryKey: isEnabled ? gatewayQueryKeys.single(id) : ['gateway', null],
    queryFn: (): Promise<Gateway | null> =>
      isEnabled ? gatewaysApi.get(id) : Promise.resolve(null),
    enabled: isEnabled,
  });
}
