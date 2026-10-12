import { useMainWindowDialogsStore } from '@/windows/main-window/stores/main-window-dialogs-store';
import { MainWindowDialogType } from '@/windows/main-window/types/main-window-dialog-type';

export function openEditConversationDialog(conversationId: string): void {
  useMainWindowDialogsStore
    .getState()
    .open({ type: MainWindowDialogType.EditConversation, conversationId });
}
