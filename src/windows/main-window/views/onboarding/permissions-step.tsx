import * as React from 'react';

import { ArrowRight } from 'lucide-react';

import { arePermissionsGranted } from '@/features/permissions/lib/are-permissions-granted';
import { usePermissionsStatus } from '@/features/permissions/queries/use-permissions-status';
import { useRequestPermission } from '@/features/permissions/queries/use-request-permission';
import { PermissionKind } from '@/features/permissions/types/permission-kind';
import { PermissionsStatusType } from '@/features/permissions/types/permissions-status-type';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { LoadingState } from '@/shared/views/loading-state';
import { PermissionRow } from '@/windows/main-window/views/onboarding/permission-row';

interface PermissionsStepProps {
  onContinue?: () => void;
}

export const PermissionsStep = ({ onContinue }: PermissionsStepProps): React.ReactElement => {
  const statusQuery = usePermissionsStatus();
  const requestPermission = useRequestPermission();

  const handleGrant = (kind: PermissionKind): void => {
    requestPermission.mutate(kind, {
      onError: (caught: unknown): void => {
        toastError(caught);
      },
    });
  };

  if (statusQuery.data === undefined) {
    return <LoadingState />;
  }

  const status = statusQuery.data;
  const isGranted = arePermissionsGranted(status);

  if (status.type === PermissionsStatusType.NotApplicable) {
    // Defensive: the parent should not render this step on non-macOS.
    if (onContinue === undefined) {
      return <></>;
    }
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Button variant="primary" onClick={onContinue}>
          {translate('onboarding.permissionsContinue')}
          <ArrowRight size={13} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[18px] font-semibold tracking-tight text-primary">
          {translate('onboarding.permissionsTitle')}
        </div>
        <div className="text-[13.5px] leading-[1.6] text-secondary">
          {translate('onboarding.permissionsBody')}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <PermissionRow
          title={translate('onboarding.permissionsScreenRecordingTitle')}
          body={translate('onboarding.permissionsScreenRecordingBody')}
          isGranted={status.screenRecording}
          isRequesting={requestPermission.isPending}
          onGrant={(): void => {
            handleGrant(PermissionKind.ScreenRecording);
          }}
        />
        <PermissionRow
          title={translate('onboarding.permissionsAccessibilityTitle')}
          body={translate('onboarding.permissionsAccessibilityBody')}
          isGranted={status.accessibility}
          isRequesting={requestPermission.isPending}
          onGrant={(): void => {
            handleGrant(PermissionKind.Accessibility);
          }}
        />
        <PermissionRow
          title={translate('onboarding.permissionsFullDiskAccessTitle')}
          body={translate('onboarding.permissionsFullDiskAccessBody')}
          isGranted={status.fullDiskAccess}
          isRequesting={requestPermission.isPending}
          onGrant={(): void => {
            handleGrant(PermissionKind.FullDiskAccess);
          }}
        />
      </div>
      {onContinue !== undefined ? (
        <div className="flex justify-center">
          <Button variant="primary" disabled={!isGranted} onClick={onContinue}>
            {translate('onboarding.permissionsContinue')}
            <ArrowRight size={13} />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
