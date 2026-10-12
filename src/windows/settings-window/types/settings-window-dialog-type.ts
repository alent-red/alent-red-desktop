export const SettingsWindowDialogType = {
  None: 'NONE',
  CreateProvider: 'CREATE_PROVIDER',
  EditProvider: 'EDIT_PROVIDER',
  DeleteProvider: 'DELETE_PROVIDER',
  CreateLlmModel: 'CREATE_LLM_MODEL',
  EditLlmModel: 'EDIT_LLM_MODEL',
  DeleteLlmModel: 'DELETE_LLM_MODEL',
  CreateBrick: 'CREATE_BRICK',
  EditBrick: 'EDIT_BRICK',
  DeleteBrick: 'DELETE_BRICK',
} as const;
export type SettingsWindowDialogType =
  (typeof SettingsWindowDialogType)[keyof typeof SettingsWindowDialogType];
