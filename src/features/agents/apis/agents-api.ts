import type { Agent } from '@/features/agents/types/agent';
import type { AgentInput } from '@/features/agents/types/agent-input';
import { invoke } from '@/shared/invoke/invoke';

interface GetAllAgentsParams {
  llmModelId: string | null;
  brickId: string | null;
}

export const agentsApi = {
  getAll: (params: GetAllAgentsParams = { llmModelId: null, brickId: null }): Promise<Agent[]> =>
    invoke<Agent[]>('agents_get_all', {
      llmModelId: params.llmModelId ?? undefined,
      brickId: params.brickId ?? undefined,
    }),
  get: (id: string): Promise<Agent> => invoke<Agent>('agents_get', { id }),
  save: (agent: AgentInput, id: string | null): Promise<Agent> =>
    invoke<Agent>('agents_save', { id: id ?? undefined, agent }),
  delete: (id: string): Promise<void> => invoke('agents_delete', { id }),
};
