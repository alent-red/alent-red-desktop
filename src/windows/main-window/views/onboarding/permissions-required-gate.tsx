import * as React from 'react';

import { translate } from '@/shared/i18n/translate';
import { OnboardingShell } from '@/shared/views/onboarding-shell';
import { PermissionsStep } from '@/windows/main-window/views/onboarding/permissions-step';

export const PermissionsRequiredGate = (): React.ReactElement => (
  <OnboardingShell>
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[18px] font-semibold tracking-tight text-primary">
          {translate('onboarding.requiredPermissionsTitle')}
        </div>
        <div className="text-[13.5px] leading-[1.6] text-secondary">
          {translate('onboarding.requiredPermissionsBody')}
        </div>
      </div>
      <PermissionsStep />
    </div>
  </OnboardingShell>
);
