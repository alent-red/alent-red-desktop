export const BrickConfigUiMovePointerCoordinateSpace = {
  Pixels: 'PIXELS',
  Normalized1000: 'NORMALIZED_1000',
} as const;
export type BrickConfigUiMovePointerCoordinateSpace =
  (typeof BrickConfigUiMovePointerCoordinateSpace)[keyof typeof BrickConfigUiMovePointerCoordinateSpace];
