import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SignupState {
  isSignedIn: boolean;
  desktopId: string;
  markSignedIn: () => void;
}

const STORAGE_KEY = 'alent-red:signup';

type SignupPersistedState = Pick<SignupState, 'isSignedIn' | 'desktopId'>;

// One UUID per install, persisted so re-launches reuse it and the same desktop
// can be recognized if it signs up again.
function generateDesktopId(): string {
  return crypto.randomUUID();
}

export const useSignupStore = create<SignupState>()(
  persist(
    (set): SignupState => ({
      isSignedIn: false,
      desktopId: generateDesktopId(),

      markSignedIn: (): void => {
        set({ isSignedIn: true });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage((): Storage => localStorage),
      partialize: (state): SignupPersistedState => ({
        isSignedIn: state.isSignedIn,
        desktopId: state.desktopId,
      }),
    },
  ),
);
