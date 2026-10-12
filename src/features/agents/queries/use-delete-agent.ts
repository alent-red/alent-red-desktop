import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { agentsApi } from '@/features/agents/apis/agents-api';
import { agentQueryKeys } from '@/features/agents/queries/agent-query-keys';

export function useDeleteAgent(): UseMutationResult<void, DefaultError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<void> => agentsApi.delete(id),
    onSuccess: (_result, id): void => {
      queryClient.removeQueries({ queryKey: agentQueryKeys.single(id) });
      void queryClient.invalidateQueries({ queryKey: agentQueryKeys.list });
    },
  });
}
