import * as React from 'react';

import { Check } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Button } from '@/shared/views/button';

interface PermissionRowProps {
  title: string;
  body: string;
  isGranted: boolean;
  isRequesting: boolean;
  onGrant: () => void;
}

export const PermissionRow = ({
  title,
  body,
  isGranted,
  isRequesting,
  onGrant,
}: PermissionRowProps): React.ReactElement => (
  <div
    className={mergeClasses(
      'flex items-start gap-3 rounded-[10px] border border-default bg-panel px-3.5 py-3',
    )}
  >
    <div className="flex-1 min-w-0 flex flex-col gap-1">
      <div className="text-[13.5px] font-semibold text-primary">{title}</div>
      <div className="text-[12px] text-muted leading-[1.5]">{body}</div>
    </div>
    {isGranted ? (
      <div className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-success)]">
        <Check size={13} strokeWidth={2.2} />
        {translate('onboarding.permissionsGranted')}
      </div>
    ) : (
      <Button variant="primary" size="sm" disabled={isRequesting} onClick={onGrant}>
        {translate('onboarding.permissionsGrant')}
      </Button>
    )}
  </div>
);
