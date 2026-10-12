import type { BrickConfig } from '@/features/bricks/types/brick-config';
import { BrickConfigType } from '@/features/bricks/types/brick-config-type';
import type { BrickConfigUiMovePointerCoordinateSpace } from '@/features/bricks/types/brick-config-ui-move-pointer-coordinate-space';
import type { BrickConfigUiMovePointerGeometry } from '@/features/bricks/types/brick-config-ui-move-pointer-geometry';
import { assertNever } from '@/shared/lib/assert-never';

export interface BuildBrickConfigInputs {
  kind: BrickConfigType;
  movePointerLlmModelId: string;
  movePointerGeometry: BrickConfigUiMovePointerGeometry;
  movePointerCoordinateSpace: BrickConfigUiMovePointerCoordinateSpace;
  trimmedCustomPath: string;
}

export function buildBrickConfig(inputs: BuildBrickConfigInputs): BrickConfig {
  const {
    kind,
    movePointerLlmModelId,
    movePointerGeometry,
    movePointerCoordinateSpace,
    trimmedCustomPath,
  } = inputs;
  switch (kind) {
    case BrickConfigType.Ui:
      return {
        type: BrickConfigType.Ui,
        movePointerLlmModelId,
        movePointerGeometry,
        movePointerCoordinateSpace,
      };
    case BrickConfigType.Custom:
      return { type: BrickConfigType.Custom, path: trimmedCustomPath };
    case BrickConfigType.Browser:
      return { type: BrickConfigType.Browser };
    case BrickConfigType.System:
      return { type: BrickConfigType.System };
    case BrickConfigType.Code:
      return { type: BrickConfigType.Code };
    case BrickConfigType.Scheduler:
      return { type: BrickConfigType.Scheduler };
    case BrickConfigType.Agent:
      return { type: BrickConfigType.Agent };
    case BrickConfigType.Renderer:
      return { type: BrickConfigType.Renderer };
    case BrickConfigType.Vision:
      return { type: BrickConfigType.Vision };
    case BrickConfigType.Skills:
      return { type: BrickConfigType.Skills };
    default:
      return assertNever(kind);
  }
}
