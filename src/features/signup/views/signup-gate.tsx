import * as React from 'react';

import { SignupForm } from '@/features/signup/views/signup-form';
import { translate } from '@/shared/i18n/translate';
import { OnboardingShell } from '@/shared/views/onboarding-shell';

export const SignupGate = (): React.ReactElement => (
  <OnboardingShell>
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[18px] font-semibold tracking-tight text-primary">
          {translate('signup.title')}
        </div>
        <div className="text-[13.5px] leading-[1.6] text-secondary">
          {translate('signup.intro')}
        </div>
      </div>
      <SignupForm />
      <div className="flex flex-col gap-2 text-[11.5px] leading-[1.6] text-muted text-center px-2">
        <div>{translate('signup.pricingNote')}</div>
        <div>{translate('signup.privacyNote')}</div>
      </div>
    </div>
  </OnboardingShell>
);
