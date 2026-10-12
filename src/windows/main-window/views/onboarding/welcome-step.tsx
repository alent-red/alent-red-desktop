import * as React from 'react';

import { ArrowRight } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';

interface WelcomeStepProps {
  onContinue: () => void;
}

export const WelcomeStep = ({ onContinue }: WelcomeStepProps): React.ReactElement => (
  <div className="flex flex-col items-center gap-5 text-center">
    <div className="text-[13.5px] leading-[1.6] text-secondary">
      {translate('onboarding.welcomeBody')}
    </div>
    <Button variant="primary" onClick={onContinue}>
      {translate('onboarding.welcomeCta')}
      <ArrowRight size={13} />
    </Button>
  </div>
);
