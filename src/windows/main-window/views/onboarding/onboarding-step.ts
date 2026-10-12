import { type ProviderConfigType } from '@/features/providers/types/provider-config-type';
import { type OnboardingStepType } from '@/windows/main-window/views/onboarding/onboarding-step-type';

export type OnboardingStep =
  | { type: typeof OnboardingStepType.Welcome }
  | { type: typeof OnboardingStepType.Permissions }
  | { type: typeof OnboardingStepType.Provider }
  | {
      type: typeof OnboardingStepType.FirstModel;
      providerId: string;
      providerConfigType: ProviderConfigType;
    }
  | {
      type: typeof OnboardingStepType.Finalizing;
      providerId: string;
      providerConfigType: ProviderConfigType;
    };
