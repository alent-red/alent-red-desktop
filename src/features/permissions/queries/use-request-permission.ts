import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { permissionsApi } from '@/features/permissions/apis/permissions-api';
import { permissionsQueryKeys } from '@/features/permissions/queries/permissions-query-keys';
import type { PermissionKind } from '@/features/permissions/types/permission-kind';

export function useRequestPermission(): UseMutationResult<void, DefaultError, PermissionKind> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (kind: PermissionKind): Promise<void> => permissionsApi.request(kind),
    onSettled: (): void => {
      void queryClient.invalidateQueries({ queryKey: permissionsQueryKeys.status });
    },
  });
}
