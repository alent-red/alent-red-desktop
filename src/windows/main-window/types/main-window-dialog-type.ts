export const MainWindowDialogType = {
  None: 'NONE',
  CreateAgent: 'CREATE_AGENT',
  EditAgent: 'EDIT_AGENT',
  DeleteAgent: 'DELETE_AGENT',
  NewConversation: 'NEW_CONVERSATION',
  EditConversation: 'EDIT_CONVERSATION',
  DeleteConversation: 'DELETE_CONVERSATION',
  SplitConversation: 'SPLIT_CONVERSATION',
  OpenAttachedFile: 'OPEN_ATTACHED_FILE',
  GatewaysManager: 'GATEWAYS_MANAGER',
} as const;
export type MainWindowDialogType = (typeof MainWindowDialogType)[keyof typeof MainWindowDialogType];
