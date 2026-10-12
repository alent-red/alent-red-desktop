import * as React from 'react';

import { isAutoAddSupportedProviderType } from '@/features/llm-models/lib/is-auto-add-supported-provider-type';
import { usePermissionsStatus } from '@/features/permissions/queries/use-permissions-status';
import { PermissionsStatusType } from '@/features/permissions/types/permissions-status-type';
import type { Provider } from '@/features/providers/types/provider';
import { setIsContentProtected } from '@/features/window-behavior/actions/set-is-content-protected';
import { assertNever } from '@/shared/lib/assert-never';
import { LoadingState } from '@/shared/views/loading-state';
import { OnboardingShell } from '@/shared/views/onboarding-shell';
import {
  useMainWindowOnboardingStore,
  type MainWindowOnboardingState,
} from '@/windows/main-window/stores/main-window-onboarding-store';
import { useMainWindowUiStore } from '@/windows/main-window/stores/main-window-ui-store';
import { FinalizingStep } from '@/windows/main-window/views/onboarding/finalizing-step';
import { FirstModelStep } from '@/windows/main-window/views/onboarding/first-model-step';
import type { OnboardingStep } from '@/windows/main-window/views/onboarding/onboarding-step';
import { OnboardingStepType } from '@/windows/main-window/views/onboarding/onboarding-step-type';
import { PermissionsStep } from '@/windows/main-window/views/onboarding/permissions-step';
import { ProviderStep } from '@/windows/main-window/views/onboarding/provider-step';
import type { OnboardingFinalizationResult } from '@/windows/main-window/views/onboarding/run-onboarding-finalization';
import { WelcomeStep } from '@/windows/main-window/views/onboarding/welcome-step';

export const Onboarding = (): React.ReactElement => {
  const [step, setStep] = React.useState<OnboardingStep>({ type: OnboardingStepType.Welcome });
  const statusQuery = usePermissionsStatus();
  const markOnboardingComplete = useMainWindowOnboardingStore(
    (state: MainWindowOnboardingState): MainWindowOnboardingState['markComplete'] =>
      state.markComplete,
  );

  const handleWelcomeContinue = (): void => {
    if (statusQuery.data?.type === PermissionsStatusType.NotApplicable) {
      setStep({ type: OnboardingStepType.Provider });
      return;
    }
    setStep({ type: OnboardingStepType.Permissions });
  };

  const handlePermissionsContinue = (): void => {
    setStep({ type: OnboardingStepType.Provider });
  };

  const handleProviderSaved = (provider: Provider): void => {
    const providerConfigType = provider.config.type;
    if (isAutoAddSupportedProviderType(providerConfigType)) {
      setStep({ type: OnboardingStepType.Finalizing, providerId: provider.id, providerConfigType });
      return;
    }
    setStep({ type: OnboardingStepType.FirstModel, providerId: provider.id, providerConfigType });
  };

  const handleFirstModelSaved = (): void => {
    if (step.type !== OnboardingStepType.FirstModel) {
      return;
    }
    setStep({
      type: OnboardingStepType.Finalizing,
      providerId: step.providerId,
      providerConfigType: step.providerConfigType,
    });
  };

  const handleFinalizingCompleted = React.useCallback(
    (result: OnboardingFinalizationResult): void => {
      useMainWindowUiStore.getState().setAgentFilter(result.agent.id);
      // Screen-capture protection stays off until the user is set up, then
      // turns on with the first agent; the Appearance toggle stays available.
      setIsContentProtected(true);
      markOnboardingComplete();
    },
    [markOnboardingComplete],
  );

  if (statusQuery.data === undefined) {
    return (
      <OnboardingShell>
        <LoadingState />
      </OnboardingShell>
    );
  }

  const renderStep = (): React.ReactElement => {
    switch (step.type) {
      case OnboardingStepType.Welcome:
        return <WelcomeStep onContinue={handleWelcomeContinue} />;
      case OnboardingStepType.Permissions:
        return <PermissionsStep onContinue={handlePermissionsContinue} />;
      case OnboardingStepType.Provider:
        return <ProviderStep onSaved={handleProviderSaved} />;
      case OnboardingStepType.FirstModel:
        return <FirstModelStep providerId={step.providerId} onSaved={handleFirstModelSaved} />;
      case OnboardingStepType.Finalizing:
        return (
          <FinalizingStep
            providerId={step.providerId}
            providerConfigType={step.providerConfigType}
            onCompleted={handleFinalizingCompleted}
          />
        );
      default:
        return assertNever(step);
    }
  };

  return <OnboardingShell>{renderStep()}</OnboardingShell>;
};
