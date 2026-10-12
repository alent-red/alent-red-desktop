import { getVersion } from '@tauri-apps/api/app';

import { pushSignup } from '@/features/signup/apis/signup-api';
import { useSignupStore } from '@/features/signup/stores/signup-store';
import type { Signup } from '@/features/signup/types/signup';
import type { SignupKind } from '@/features/signup/types/signup-kind';

export interface SubmitSignupInput {
  kind: SignupKind;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  companyName: string | null;
}

// The lead must reach the server before the user gets in, so a failure
// propagates and nothing is marked signed in.
export async function submitSignup(input: SubmitSignupInput): Promise<void> {
  const appVersion = await getVersion();
  const { desktopId } = useSignupStore.getState();
  const signup: Signup = {
    kind: input.kind,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    countryCode: input.countryCode,
    companyName: input.companyName,
    appVersion,
    desktopId,
  };
  await pushSignup(signup);
  useSignupStore.getState().markSignedIn();
}
