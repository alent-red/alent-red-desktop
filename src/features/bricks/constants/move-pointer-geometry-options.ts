import { BrickConfigUiMovePointerGeometry } from '@/features/bricks/types/brick-config-ui-move-pointer-geometry';
import type { TranslationKey } from '@/shared/i18n/translate';

export const MOVE_POINTER_GEOMETRY_OPTIONS: {
  value: BrickConfigUiMovePointerGeometry;
  labelKey: TranslationKey;
}[] = [
  { value: BrickConfigUiMovePointerGeometry.Point, labelKey: 'bricks.movePointerGeometryPoint' },
  {
    value: BrickConfigUiMovePointerGeometry.BoundingBox,
    labelKey: 'bricks.movePointerGeometryBoundingBox',
  },
];
