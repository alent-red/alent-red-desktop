import type { PermissionKind } from '@/features/permissions/types/permission-kind';
import type { PermissionsStatus } from '@/features/permissions/types/permissions-status';
import { invoke } from '@/shared/invoke/invoke';

export const permissionsApi = {
  check: (): Promise<PermissionsStatus> => invoke<PermissionsStatus>('permissions_check'),
  request: (kind: PermissionKind): Promise<void> => invoke('permissions_request', { kind }),
};
