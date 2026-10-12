export const PermissionsStatusType = {
  Macos: 'MACOS',
  NotApplicable: 'NOT_APPLICABLE',
} as const;
export type PermissionsStatusType =
  (typeof PermissionsStatusType)[keyof typeof PermissionsStatusType];
