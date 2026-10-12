export const PermissionKind = {
  ScreenRecording: 'SCREEN_RECORDING',
  Accessibility: 'ACCESSIBILITY',
  FullDiskAccess: 'FULL_DISK_ACCESS',
} as const;
export type PermissionKind = (typeof PermissionKind)[keyof typeof PermissionKind];
