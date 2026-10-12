import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { agentsApi } from '@/features/agents/apis/agents-api';
import { agentQueryKeys } from '@/features/agents/queries/agent-query-keys';
import type { Agent } from '@/features/agents/types/agent';
import { compareNamesNaturally } from '@/shared/lib/compare-names-naturally';

export function useAgents(): UseQueryResult<Agent[]> {
  return useQuery({
    queryKey: agentQueryKeys.list,
    queryFn: async (): Promise<Agent[]> => {
      const list = await agentsApi.getAll();
      return [...list].sort((left, right): number => compareNamesNaturally(left.name, right.name));
    },
  });
}
