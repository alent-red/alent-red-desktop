import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { bricksApi } from '@/features/bricks/apis/bricks-api';
import { brickQueryKeys } from '@/features/bricks/queries/brick-query-keys';

export function useDeleteBrick(): UseMutationResult<void, DefaultError, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string): Promise<void> => bricksApi.delete(id),
    onSuccess: (_result, id): void => {
      queryClient.removeQueries({ queryKey: brickQueryKeys.single(id) });
      void queryClient.invalidateQueries({ queryKey: brickQueryKeys.all });
    },
  });
}
