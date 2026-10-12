import {
  AUTO_ADD_LLM_MODELS,
  type AutoAddSupportedProviderType,
} from '@/features/llm-models/constants/auto-add-llm-models';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import type { LlmModelInput } from '@/features/llm-models/types/llm-model-input';

interface SaveLlmModelMutation {
  mutateAsync: (args: { input: LlmModelInput; id: string | null }) => Promise<LlmModel>;
}

export interface RunAutoAddLlmModelsResult {
  failedNames: string[];
}

// Sequential on purpose: every model save triggers a full refresh in the
// core, and concurrent refreshes race each other.
export async function runAutoAddLlmModelsForProvider(
  providerId: string,
  providerType: AutoAddSupportedProviderType,
  saveLlmModel: SaveLlmModelMutation,
): Promise<RunAutoAddLlmModelsResult> {
  const templates = AUTO_ADD_LLM_MODELS[providerType];
  const failedNames: string[] = [];
  for (const template of templates) {
    try {
      await saveLlmModel.mutateAsync({ input: { ...template, providerId }, id: null });
    } catch {
      failedNames.push(template.name);
    }
  }
  return { failedNames };
}
