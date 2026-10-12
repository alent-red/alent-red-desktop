import { useSettingsWindowDialogsStore } from '@/windows/settings-window/stores/settings-window-dialogs-store';

export function closeSettingsWindowDialog(): void {
  useSettingsWindowDialogsStore.getState().close();
}
