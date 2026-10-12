import { type SettingsWindowDialogType } from '@/windows/settings-window/types/settings-window-dialog-type';

export type SettingsWindowDialogState =
  | { type: typeof SettingsWindowDialogType.None }
  | { type: typeof SettingsWindowDialogType.CreateProvider }
  | { type: typeof SettingsWindowDialogType.EditProvider; providerId: string }
  | { type: typeof SettingsWindowDialogType.DeleteProvider; providerId: string }
  | { type: typeof SettingsWindowDialogType.CreateLlmModel }
  | { type: typeof SettingsWindowDialogType.EditLlmModel; llmModelId: string }
  | { type: typeof SettingsWindowDialogType.DeleteLlmModel; llmModelId: string }
  | { type: typeof SettingsWindowDialogType.CreateBrick }
  | { type: typeof SettingsWindowDialogType.EditBrick; brickId: string }
  | { type: typeof SettingsWindowDialogType.DeleteBrick; brickId: string };
