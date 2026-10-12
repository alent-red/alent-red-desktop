import { useMainWindowDialogsStore } from '@/windows/main-window/stores/main-window-dialogs-store';
import { MainWindowDialogType } from '@/windows/main-window/types/main-window-dialog-type';

export function openNewConversationDialog(presetAgentId: string | null): void {
  useMainWindowDialogsStore
    .getState()
    .open({ type: MainWindowDialogType.NewConversation, presetAgentId });
}
