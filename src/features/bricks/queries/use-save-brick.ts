import {
  type DefaultError,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { bricksApi } from '@/features/bricks/apis/bricks-api';
import { brickQueryKeys } from '@/features/bricks/queries/brick-query-keys';
import type { Brick } from '@/features/bricks/types/brick';
import type { BrickInput } from '@/features/bricks/types/brick-input';

interface SaveBrickArgs {
  input: BrickInput;
  id: string | null;
}

export function useSaveBrick(): UseMutationResult<Brick, DefaultError, SaveBrickArgs> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: SaveBrickArgs): Promise<Brick> => bricksApi.save(args.input, args.id),
    onSuccess: (saved: Brick): void => {
      queryClient.setQueryData(brickQueryKeys.single(saved.id), saved);
      void queryClient.invalidateQueries({ queryKey: brickQueryKeys.all });
    },
  });
}
