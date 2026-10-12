import type { Brick } from '@/features/bricks/types/brick';
import type { BrickInput } from '@/features/bricks/types/brick-input';
import { invoke } from '@/shared/invoke/invoke';

export const bricksApi = {
  getAll: (agentId: string | null): Promise<Brick[]> =>
    invoke<Brick[]>('bricks_get_all', { agentId: agentId ?? undefined }),
  get: (id: string): Promise<Brick> => invoke<Brick>('bricks_get', { id }),
  save: (brick: BrickInput, id: string | null): Promise<Brick> =>
    invoke<Brick>('bricks_save', { id: id ?? undefined, brick }),
  delete: (id: string): Promise<void> => invoke('bricks_delete', { id }),
};
