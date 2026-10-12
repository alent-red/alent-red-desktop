import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { llmModelsApi } from '@/features/llm-models/apis/llm-models-api';
import { llmModelQueryKeys } from '@/features/llm-models/queries/llm-model-query-keys';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import type { LlmModelInput } from '@/features/llm-models/types/llm-model-input';

interface SaveLlmModelArgs {
  input: LlmModelInput;
  id: string | null;
}

export function useSaveLlmModel(): UseMutationResult<LlmModel, DefaultError, SaveLlmModelArgs> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: SaveLlmModelArgs): Promise<LlmModel> =>
      llmModelsApi.save(args.input, args.id),
    onSuccess: (saved: LlmModel): void => {
      queryClient.setQueryData(llmModelQueryKeys.single(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: llmModelQueryKeys.all });
    },
  });
}
