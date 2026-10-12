import * as React from 'react';

import { useMutation } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';

import type { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import { translate } from '@/shared/i18n/translate';
import { presentError } from '@/shared/lib/present-error';
import { Button } from '@/shared/views/button';
import { Spinner } from '@/shared/views/spinner';
import {
  runOnboardingFinalization,
  type OnboardingFinalizationResult,
} from '@/windows/main-window/views/onboarding/run-onboarding-finalization';

interface FinalizingStepProps {
  providerId: string;
  providerConfigType: ProviderConfigType;
  onCompleted: (result: OnboardingFinalizationResult) => void;
}

interface FinalizationArgs {
  providerId: string;
  providerConfigType: ProviderConfigType;
}

export const FinalizingStep = ({
  providerId,
  providerConfigType,
  onCompleted,
}: FinalizingStepProps): React.ReactElement => {
  const finalization = useMutation({
    mutationFn: (args: FinalizationArgs): Promise<OnboardingFinalizationResult> =>
      runOnboardingFinalization(args),
    onSuccess: onCompleted,
  });

  // The mutation's `isIdle` is a snapshot of the previous render — both
  // StrictMode mount-effects see the same `true`, so it cannot dedupe. A ref
  // updated synchronously inside the kick-off is the only safe guard. Bumping
  // `attemptKey` on retry clears the ref through the dep array.
  const [attemptKey, setAttemptKey] = React.useState(0);
  const startedAttemptRef = React.useRef<number | null>(null);

  React.useEffect((): void => {
    if (startedAttemptRef.current === attemptKey) {
      return;
    }
    startedAttemptRef.current = attemptKey;
    finalization.mutate({ providerId, providerConfigType });
  }, [attemptKey, finalization, providerId, providerConfigType]);

  const handleRetry = (): void => {
    finalization.reset();
    setAttemptKey((value): number => value + 1);
  };

  if (finalization.isError) {
    const presented = presentError(finalization.error);
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-[18px] font-semibold tracking-tight text-primary">
          {translate('onboarding.finalizingFailed')}
        </div>
        <div className="text-[13px] text-muted font-mono break-words max-h-[120px] overflow-auto rounded-[8px] border border-default bg-panel px-3 py-2">
          {presented.detail ?? presented.title}
        </div>
        <Button variant="primary" onClick={handleRetry}>
          <RefreshCw size={13} />
          {translate('onboarding.finalizingRetry')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Spinner size={22} className="text-[var(--text-secondary)]" />
      <div className="text-[15px] font-semibold tracking-tight text-primary">
        {translate('onboarding.finalizingTitle')}
      </div>
      <div className="text-[13px] text-secondary leading-[1.5]">
        {translate('onboarding.finalizingBody')}
      </div>
    </div>
  );
};
