import { useMainWindowDialogsStore } from '@/windows/main-window/stores/main-window-dialogs-store';

export function closeMainWindowDialog(): void {
  useMainWindowDialogsStore.getState().close();
}
