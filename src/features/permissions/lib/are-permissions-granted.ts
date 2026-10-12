import type { PermissionsStatus } from '@/features/permissions/types/permissions-status';
import { PermissionsStatusType } from '@/features/permissions/types/permissions-status-type';

export function arePermissionsGranted(status: PermissionsStatus | null): boolean {
  if (status === null) {
    return false;
  }
  if (status.type === PermissionsStatusType.NotApplicable) {
    return true;
  }
  return status.screenRecording && status.accessibility && status.fullDiskAccess;
}
