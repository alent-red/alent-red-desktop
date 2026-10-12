import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { llmModelsApi } from '@/features/llm-models/apis/llm-models-api';
import { llmModelQueryKeys } from '@/features/llm-models/queries/llm-model-query-keys';
import type { LlmModel } from '@/features/llm-models/types/llm-model';

export function useLlmModel(id: string | null | undefined): UseQueryResult<LlmModel | null> {
  const isEnabled = id !== null && id !== undefined && id !== '';
  return useQuery({
    queryKey: isEnabled ? llmModelQueryKeys.single(id) : ['llm-model', null],
    queryFn: (): Promise<LlmModel | null> =>
      isEnabled ? llmModelsApi.get(id) : Promise.resolve(null),
    enabled: isEnabled,
  });
}
