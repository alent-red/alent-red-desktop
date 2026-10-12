import { useSettingsWindowDialogsStore } from '@/windows/settings-window/stores/settings-window-dialogs-store';
import { SettingsWindowDialogType } from '@/windows/settings-window/types/settings-window-dialog-type';

export function openCreateProviderDialog(): void {
  useSettingsWindowDialogsStore.getState().open({ type: SettingsWindowDialogType.CreateProvider });
}
