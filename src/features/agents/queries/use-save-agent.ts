import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { agentsApi } from '@/features/agents/apis/agents-api';
import { agentQueryKeys } from '@/features/agents/queries/agent-query-keys';
import type { Agent } from '@/features/agents/types/agent';
import type { AgentInput } from '@/features/agents/types/agent-input';

interface SaveAgentArgs {
  input: AgentInput;
  id: string | null;
}

export function useSaveAgent(): UseMutationResult<Agent, DefaultError, SaveAgentArgs> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: SaveAgentArgs): Promise<Agent> => agentsApi.save(args.input, args.id),
    onSuccess: (saved: Agent): void => {
      queryClient.setQueryData(agentQueryKeys.single(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: agentQueryKeys.list });
    },
  });
}
