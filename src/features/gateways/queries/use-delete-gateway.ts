import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { gatewaysApi } from '@/features/gateways/apis/gateways-api';
import { gatewayQueryKeys } from '@/features/gateways/queries/gateway-query-keys';

export function useDeleteGateway(): UseMutationResult<void, DefaultError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<void> => gatewaysApi.delete(id),
    onSuccess: (_result, id): void => {
      queryClient.removeQueries({ queryKey: gatewayQueryKeys.single(id) });
      void queryClient.invalidateQueries({ queryKey: gatewayQueryKeys.all });
    },
  });
}
