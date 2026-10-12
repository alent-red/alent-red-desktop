export const OnboardingStepType = {
  Welcome: 'WELCOME',
  Permissions: 'PERMISSIONS',
  Provider: 'PROVIDER',
  FirstModel: 'FIRST_MODEL',
  Finalizing: 'FINALIZING',
} as const;
export type OnboardingStepType = (typeof OnboardingStepType)[keyof typeof OnboardingStepType];
