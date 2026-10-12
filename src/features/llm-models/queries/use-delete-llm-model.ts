import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { llmModelsApi } from '@/features/llm-models/apis/llm-models-api';
import { llmModelQueryKeys } from '@/features/llm-models/queries/llm-model-query-keys';

export function useDeleteLlmModel(): UseMutationResult<void, DefaultError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<void> => llmModelsApi.delete(id),
    onSuccess: (_result, id): void => {
      queryClient.removeQueries({ queryKey: llmModelQueryKeys.single(id) });
      void queryClient.invalidateQueries({ queryKey: llmModelQueryKeys.all });
    },
  });
}
