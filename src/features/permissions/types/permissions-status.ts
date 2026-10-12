import { type PermissionsStatusType } from '@/features/permissions/types/permissions-status-type';

export type PermissionsStatus =
  | {
      type: typeof PermissionsStatusType.Macos;
      screenRecording: boolean;
      accessibility: boolean;
      fullDiskAccess: boolean;
    }
  | { type: typeof PermissionsStatusType.NotApplicable };
