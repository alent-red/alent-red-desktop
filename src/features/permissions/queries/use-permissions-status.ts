import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { permissionsApi } from '@/features/permissions/apis/permissions-api';
import { permissionsQueryKeys } from '@/features/permissions/queries/permissions-query-keys';
import type { PermissionsStatus } from '@/features/permissions/types/permissions-status';

export function usePermissionsStatus(): UseQueryResult<PermissionsStatus> {
  return useQuery({
    queryKey: permissionsQueryKeys.status,
    queryFn: (): Promise<PermissionsStatus> => permissionsApi.check(),
    refetchOnWindowFocus: true,
  });
}
