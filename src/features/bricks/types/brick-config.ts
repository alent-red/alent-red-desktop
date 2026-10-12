import { type BrickConfigType } from '@/features/bricks/types/brick-config-type';
import type { BrickConfigUiMovePointerCoordinateSpace } from '@/features/bricks/types/brick-config-ui-move-pointer-coordinate-space';
import type { BrickConfigUiMovePointerGeometry } from '@/features/bricks/types/brick-config-ui-move-pointer-geometry';

export type BrickConfig =
  | {
      type: typeof BrickConfigType.Ui;
      movePointerLlmModelId: string;
      movePointerGeometry: BrickConfigUiMovePointerGeometry;
      movePointerCoordinateSpace: BrickConfigUiMovePointerCoordinateSpace;
    }
  | { type: typeof BrickConfigType.Code }
  | { type: typeof BrickConfigType.System }
  | { type: typeof BrickConfigType.Scheduler }
  | { type: typeof BrickConfigType.Renderer }
  | { type: typeof BrickConfigType.Browser }
  | { type: typeof BrickConfigType.Agent }
  | { type: typeof BrickConfigType.Custom; path: string }
  | { type: typeof BrickConfigType.Vision }
  | { type: typeof BrickConfigType.Skills };
