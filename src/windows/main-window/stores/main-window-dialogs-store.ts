import { create } from 'zustand';

import type { MainWindowDialogState } from '@/windows/main-window/types/main-window-dialog-state';
import { MainWindowDialogType } from '@/windows/main-window/types/main-window-dialog-type';

export interface MainWindowDialogsState {
  dialog: MainWindowDialogState;
  open: (
    dialog: Exclude<MainWindowDialogState, { type: typeof MainWindowDialogType.None }>,
  ) => void;
  close: () => void;
}

export const useMainWindowDialogsStore = create<MainWindowDialogsState>(
  (set): MainWindowDialogsState => ({
    dialog: { type: MainWindowDialogType.None },
    open: (dialog): void => {
      set({ dialog });
    },
    close: (): void => {
      set({ dialog: { type: MainWindowDialogType.None } });
    },
  }),
);
