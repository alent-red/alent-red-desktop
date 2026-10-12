import { create } from 'zustand';

import type { SettingsWindowDialogState } from '@/windows/settings-window/types/settings-window-dialog-state';
import { SettingsWindowDialogType } from '@/windows/settings-window/types/settings-window-dialog-type';

export interface SettingsWindowDialogsState {
  dialog: SettingsWindowDialogState;
  open: (
    dialog: Exclude<SettingsWindowDialogState, { type: typeof SettingsWindowDialogType.None }>,
  ) => void;
  close: () => void;
}

export const useSettingsWindowDialogsStore = create<SettingsWindowDialogsState>(
  (set): SettingsWindowDialogsState => ({
    dialog: { type: SettingsWindowDialogType.None },
    open: (dialog): void => {
      set({ dialog });
    },
    close: (): void => {
      set({ dialog: { type: SettingsWindowDialogType.None } });
    },
  }),
);
