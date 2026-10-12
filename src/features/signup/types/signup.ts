import type { SignupKind } from '@/features/signup/types/signup-kind';

export interface Signup {
  kind: SignupKind;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  companyName: string | null;
  appVersion: string;
  desktopId: string;
}
