import * as React from 'react';

import { Plus, Search } from 'lucide-react';

import { ConversationsList } from '@/features/conversations/views/conversations-list';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Input } from '@/shared/views/input';
import { Tooltip } from '@/shared/views/tooltip';
import { openDeleteConversationDialog } from '@/windows/main-window/actions/open-delete-conversation-dialog';
import { openEditConversationDialog } from '@/windows/main-window/actions/open-edit-conversation-dialog';
import { startNewConversation } from '@/windows/main-window/actions/start-new-conversation';
import {
  useMainWindowUiStore,
  type MainWindowUiState,
} from '@/windows/main-window/stores/main-window-ui-store';

export const ConversationsListView = (): React.ReactElement => {
  const agentFilter = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['agentFilter'] => state.agentFilter,
  );
  const selectedConversationId = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['selectedConversationId'] =>
      state.selectedConversationId,
  );
  const setSelected = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['setSelectedConversationId'] =>
      state.setSelectedConversationId,
  );

  const [query, setQuery] = React.useState('');

  const handleNewConversation = (): void => {
    void startNewConversation(agentFilter);
  };

  return (
    <>
      <div className="px-3 py-2.5 flex items-center gap-2">
        <div className="flex-1 relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            strokeWidth={2.1}
          />
          <Input
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              setQuery(event.target.value);
            }}
            placeholder={translate('conversations.search')}
            className="pl-8 h-8"
          />
        </div>
        <Tooltip content={translate('conversations.newButton')}>
          <Button
            size="icon-sm"
            variant="primary"
            onClick={handleNewConversation}
            aria-label={translate('conversations.newButton')}
          >
            <Plus size={14} strokeWidth={2.4} />
          </Button>
        </Tooltip>
      </div>

      <ConversationsList
        query={query}
        agentFilter={agentFilter}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelected}
        onEdit={openEditConversationDialog}
        onDelete={openDeleteConversationDialog}
      />
    </>
  );
};
