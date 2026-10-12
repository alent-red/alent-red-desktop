import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SettingsTab } from '@/windows/settings-window/types/settings-tab';

export interface SettingsWindowUiState {
  settingsTab: SettingsTab;
  setSettingsTab: (tab: SettingsTab) => void;
}

type SettingsWindowUiPersistedState = Pick<SettingsWindowUiState, 'settingsTab'>;

const STORAGE_KEY = 'alent-red:settings-window-ui';

export const useSettingsWindowUiStore = create<SettingsWindowUiState>()(
  persist(
    (set): SettingsWindowUiState => ({
      settingsTab: SettingsTab.Providers,

      setSettingsTab: (tab): void => {
        set({ settingsTab: tab });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage((): Storage => localStorage),
      partialize: (state): SettingsWindowUiPersistedState => ({
        settingsTab: state.settingsTab,
      }),
    },
  ),
);
