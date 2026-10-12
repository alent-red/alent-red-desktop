import type { LlmModel } from '@/features/llm-models/types/llm-model';
import type { LlmModelInput } from '@/features/llm-models/types/llm-model-input';
import { invoke } from '@/shared/invoke/invoke';

export const llmModelsApi = {
  getAll: (providerId: string | null): Promise<LlmModel[]> =>
    invoke<LlmModel[]>('llm_models_get_all', { providerId: providerId ?? undefined }),
  get: (id: string): Promise<LlmModel> => invoke<LlmModel>('llm_models_get', { id }),
  save: (llmModel: LlmModelInput, id: string | null): Promise<LlmModel> =>
    invoke<LlmModel>('llm_models_save', { id: id ?? undefined, llmModel }),
  delete: (id: string): Promise<void> => invoke('llm_models_delete', { id }),
};
