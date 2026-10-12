import * as React from 'react';

import { AgentFormDialog } from '@/features/agents/views/agent-form-dialog';
import { DeleteAgentDialog } from '@/features/agents/views/delete-agent-dialog';
import { ConversationFormDialog } from '@/features/conversations/views/conversation-form-dialog';
import { DeleteConversationDialog } from '@/features/conversations/views/delete-conversation-dialog';
import { SplitConversationDialog } from '@/features/conversations/views/split-conversation-dialog';
import { OpenAttachedFileDialog } from '@/features/messages/views/open-attached-file-dialog';
import { assertNever } from '@/shared/lib/assert-never';
import { closeMainWindowDialog } from '@/windows/main-window/actions/close-main-window-dialog';
import { openCreateAgentDialog } from '@/windows/main-window/actions/open-create-agent-dialog';
import {
  useMainWindowDialogsStore,
  type MainWindowDialogsState,
} from '@/windows/main-window/stores/main-window-dialogs-store';
import { useMainWindowUiStore } from '@/windows/main-window/stores/main-window-ui-store';
import { MainWindowDialogType } from '@/windows/main-window/types/main-window-dialog-type';
import { GatewaysManagerDialog } from '@/windows/main-window/views/gateways-manager-dialog';
import { openWindow } from '@/windows/registry';
import { WindowKind } from '@/windows/window-kind';

export const MainWindowDialogs = (): React.ReactElement | null => {
  const dialog = useMainWindowDialogsStore(
    (state: MainWindowDialogsState): MainWindowDialogsState['dialog'] => state.dialog,
  );

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      closeMainWindowDialog();
    }
  };

  const handleConversationCreated = (conversationId: string): void => {
    useMainWindowUiStore.getState().setSelectedConversationId(conversationId);
  };

  const handleConversationDeleted = (deletedConversationId: string): void => {
    const store = useMainWindowUiStore.getState();
    if (store.selectedConversationId === deletedConversationId) {
      store.setSelectedConversationId(null);
    }
  };

  const handleOpenBricksSettings = (): void => {
    closeMainWindowDialog();
    void openWindow(WindowKind.Settings);
  };

  switch (dialog.type) {
    case MainWindowDialogType.None:
      return null;
    case MainWindowDialogType.CreateAgent:
      return (
        <AgentFormDialog
          isCreating
          isOpen
          onOpenChange={handleOpenChange}
          agentId={null}
          onOpenBricksSettings={handleOpenBricksSettings}
        />
      );
    case MainWindowDialogType.EditAgent:
      return (
        <AgentFormDialog
          isCreating={false}
          isOpen
          onOpenChange={handleOpenChange}
          agentId={dialog.agentId}
          onOpenBricksSettings={handleOpenBricksSettings}
        />
      );
    case MainWindowDialogType.DeleteAgent:
      return <DeleteAgentDialog agentId={dialog.agentId} onClose={closeMainWindowDialog} />;
    case MainWindowDialogType.NewConversation:
      return (
        <ConversationFormDialog
          isCreating
          isOpen
          onOpenChange={handleOpenChange}
          conversationId={null}
          presetAgentId={dialog.presetAgentId}
          onConversationCreated={handleConversationCreated}
          onCreateAgent={openCreateAgentDialog}
        />
      );
    case MainWindowDialogType.EditConversation:
      return (
        <ConversationFormDialog
          isCreating={false}
          isOpen
          onOpenChange={handleOpenChange}
          conversationId={dialog.conversationId}
          presetAgentId={null}
          onConversationCreated={handleConversationCreated}
          onCreateAgent={openCreateAgentDialog}
        />
      );
    case MainWindowDialogType.DeleteConversation:
      return (
        <DeleteConversationDialog
          conversationId={dialog.conversationId}
          onClose={closeMainWindowDialog}
          onDeleted={handleConversationDeleted}
        />
      );
    case MainWindowDialogType.SplitConversation:
      return (
        <SplitConversationDialog messageId={dialog.messageId} onClose={closeMainWindowDialog} />
      );
    case MainWindowDialogType.OpenAttachedFile:
      return <OpenAttachedFileDialog path={dialog.path} onClose={closeMainWindowDialog} />;
    case MainWindowDialogType.GatewaysManager:
      return <GatewaysManagerDialog />;
    default:
      return assertNever(dialog);
  }
};
