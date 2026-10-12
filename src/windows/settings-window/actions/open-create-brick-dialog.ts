import { useSettingsWindowDialogsStore } from '@/windows/settings-window/stores/settings-window-dialogs-store';
import { SettingsWindowDialogType } from '@/windows/settings-window/types/settings-window-dialog-type';

export function openCreateBrickDialog(): void {
  useSettingsWindowDialogsStore.getState().open({ type: SettingsWindowDialogType.CreateBrick });
}
