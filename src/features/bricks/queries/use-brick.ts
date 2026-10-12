import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { bricksApi } from '@/features/bricks/apis/bricks-api';
import { brickQueryKeys } from '@/features/bricks/queries/brick-query-keys';
import type { Brick } from '@/features/bricks/types/brick';

export function useBrick(id: string | null | undefined): UseQueryResult<Brick | null> {
  const isEnabled = id !== null && id !== undefined && id !== '';
  return useQuery({
    queryKey: isEnabled ? brickQueryKeys.single(id) : ['brick', null],
    queryFn: (): Promise<Brick | null> => (isEnabled ? bricksApi.get(id) : Promise.resolve(null)),
    enabled: isEnabled,
  });
}
