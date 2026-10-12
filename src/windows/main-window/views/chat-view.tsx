import * as React from 'react';

import { ChatActive } from '@/features/conversations/views/chat-active';
import { ChatEmpty } from '@/features/conversations/views/chat-empty';
import { openAttachedFileDialog } from '@/windows/main-window/actions/open-attached-file-dialog';
import { openDeleteConversationDialog } from '@/windows/main-window/actions/open-delete-conversation-dialog';
import { openEditConversationDialog } from '@/windows/main-window/actions/open-edit-conversation-dialog';
import { openSplitConversationDialog } from '@/windows/main-window/actions/open-split-conversation-dialog';
import { startNewConversation } from '@/windows/main-window/actions/start-new-conversation';
import {
  useMainWindowUiStore,
  type MainWindowUiState,
} from '@/windows/main-window/stores/main-window-ui-store';

export const ChatView = (): React.ReactElement => {
  const selectedId = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['selectedConversationId'] =>
      state.selectedConversationId,
  );
  const setSelected = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['setSelectedConversationId'] =>
      state.setSelectedConversationId,
  );

  const handleConversationGone = React.useCallback((): void => {
    setSelected(null);
  }, [setSelected]);

  const handleNewConversation = React.useCallback((): void => {
    void startNewConversation(null);
  }, []);

  if (selectedId === null) {
    return <ChatEmpty onNewConversation={handleNewConversation} />;
  }
  return (
    <ChatActive
      conversationId={selectedId}
      key={selectedId}
      onEdit={openEditConversationDialog}
      onDelete={openDeleteConversationDialog}
      onConversationGone={handleConversationGone}
      onSplitConversation={openSplitConversationDialog}
      onOpenAttachedFile={openAttachedFileDialog}
    />
  );
};
