import { BrickConfigUiMovePointerCoordinateSpace } from '@/features/bricks/types/brick-config-ui-move-pointer-coordinate-space';
import type { TranslationKey } from '@/shared/i18n/translate';

export const MOVE_POINTER_COORDINATE_SPACE_OPTIONS: {
  value: BrickConfigUiMovePointerCoordinateSpace;
  labelKey: TranslationKey;
}[] = [
  {
    value: BrickConfigUiMovePointerCoordinateSpace.Pixels,
    labelKey: 'bricks.movePointerCoordinateSpacePixels',
  },
  {
    value: BrickConfigUiMovePointerCoordinateSpace.Normalized1000,
    labelKey: 'bricks.movePointerCoordinateSpaceNormalized1000',
  },
];
