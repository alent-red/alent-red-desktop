import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { llmModelsApi } from '@/features/llm-models/apis/llm-models-api';
import { llmModelQueryKeys } from '@/features/llm-models/queries/llm-model-query-keys';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { compareNamesNaturally } from '@/shared/lib/compare-names-naturally';

export function useLlmModels(providerId: string | null): UseQueryResult<LlmModel[]> {
  return useQuery({
    queryKey: llmModelQueryKeys.list(providerId),
    queryFn: async (): Promise<LlmModel[]> => {
      const list = await llmModelsApi.getAll(providerId);
      return [...list].sort((left, right): number => compareNamesNaturally(left.name, right.name));
    },
  });
}
