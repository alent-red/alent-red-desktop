import type { BrickConfig } from '@/features/bricks/types/brick-config';

export interface Brick {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  config: BrickConfig;
}
