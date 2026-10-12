import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { agentsApi } from '@/features/agents/apis/agents-api';
import { agentQueryKeys } from '@/features/agents/queries/agent-query-keys';
import type { Agent } from '@/features/agents/types/agent';

export function useAgent(id: string | null | undefined): UseQueryResult<Agent | null> {
  const isEnabled = id !== null && id !== undefined && id !== '';
  return useQuery({
    queryKey: isEnabled ? agentQueryKeys.single(id) : ['agent', null],
    queryFn: (): Promise<Agent | null> => (isEnabled ? agentsApi.get(id) : Promise.resolve(null)),
    enabled: isEnabled,
  });
}
