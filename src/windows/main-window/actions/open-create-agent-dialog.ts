import { useMainWindowDialogsStore } from '@/windows/main-window/stores/main-window-dialogs-store';
import { MainWindowDialogType } from '@/windows/main-window/types/main-window-dialog-type';

export function openCreateAgentDialog(): void {
  useMainWindowDialogsStore.getState().open({ type: MainWindowDialogType.CreateAgent });
}
