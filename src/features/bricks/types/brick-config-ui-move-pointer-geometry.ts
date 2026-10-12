export const BrickConfigUiMovePointerGeometry = {
  Point: 'POINT',
  BoundingBox: 'BOUNDING_BOX',
} as const;
export type BrickConfigUiMovePointerGeometry =
  (typeof BrickConfigUiMovePointerGeometry)[keyof typeof BrickConfigUiMovePointerGeometry];
