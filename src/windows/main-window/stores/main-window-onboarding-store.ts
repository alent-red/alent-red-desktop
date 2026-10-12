import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface MainWindowOnboardingState {
  isComplete: boolean;
  markComplete: () => void;
}

const STORAGE_KEY = 'alent-red:main-window-onboarding';

export const useMainWindowOnboardingStore = create<MainWindowOnboardingState>()(
  persist(
    (set): MainWindowOnboardingState => ({
      isComplete: false,
      markComplete: (): void => {
        set({ isComplete: true });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage((): Storage => localStorage),
      partialize: (state): Pick<MainWindowOnboardingState, 'isComplete'> => ({
        isComplete: state.isComplete,
      }),
    },
  ),
);
