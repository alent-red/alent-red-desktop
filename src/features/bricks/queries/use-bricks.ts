import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { bricksApi } from '@/features/bricks/apis/bricks-api';
import { brickQueryKeys } from '@/features/bricks/queries/brick-query-keys';
import type { Brick } from '@/features/bricks/types/brick';
import { compareNamesNaturally } from '@/shared/lib/compare-names-naturally';

export function useBricks(agentId: string | null): UseQueryResult<Brick[]> {
  return useQuery({
    queryKey: brickQueryKeys.list(agentId),
    queryFn: async (): Promise<Brick[]> => {
      const list = await bricksApi.getAll(agentId);
      return [...list].sort((left, right): number => compareNamesNaturally(left.name, right.name));
    },
  });
}
