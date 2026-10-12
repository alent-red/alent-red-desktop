import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { gatewaysApi } from '@/features/gateways/apis/gateways-api';
import { gatewayQueryKeys } from '@/features/gateways/queries/gateway-query-keys';
import type { Gateway } from '@/features/gateways/types/gateway';
import type { GatewayInput } from '@/features/gateways/types/gateway-input';

interface SaveGatewayArgs {
  input: GatewayInput;
  id: string | null;
}

export function useSaveGateway(): UseMutationResult<Gateway, DefaultError, SaveGatewayArgs> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: SaveGatewayArgs): Promise<Gateway> => gatewaysApi.save(args.input, args.id),
    onSuccess: (saved: Gateway): void => {
      queryClient.setQueryData(gatewayQueryKeys.single(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: gatewayQueryKeys.all });
    },
  });
}
