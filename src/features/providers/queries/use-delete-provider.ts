import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { providersApi } from '@/features/providers/apis/providers-api';
import { providerQueryKeys } from '@/features/providers/queries/provider-query-keys';

export function useDeleteProvider(): UseMutationResult<void, DefaultError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<void> => providersApi.delete(id),
    onSuccess: (_result, id): void => {
      queryClient.removeQueries({ queryKey: providerQueryKeys.single(id) });
      void queryClient.invalidateQueries({ queryKey: providerQueryKeys.list });
    },
  });
}
