import { type MainWindowDialogType } from '@/windows/main-window/types/main-window-dialog-type';

export type MainWindowDialogState =
  | { type: typeof MainWindowDialogType.None }
  | { type: typeof MainWindowDialogType.CreateAgent }
  | { type: typeof MainWindowDialogType.EditAgent; agentId: string }
  | { type: typeof MainWindowDialogType.DeleteAgent; agentId: string }
  | { type: typeof MainWindowDialogType.NewConversation; presetAgentId: string | null }
  | { type: typeof MainWindowDialogType.EditConversation; conversationId: string }
  | { type: typeof MainWindowDialogType.DeleteConversation; conversationId: string }
  | { type: typeof MainWindowDialogType.SplitConversation; messageId: string }
  | { type: typeof MainWindowDialogType.OpenAttachedFile; path: string }
  | { type: typeof MainWindowDialogType.GatewaysManager };
