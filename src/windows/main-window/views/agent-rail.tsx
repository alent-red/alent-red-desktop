import * as React from 'react';

import { Cable, MessageSquarePlus, Plus, Settings } from 'lucide-react';

import { AgentAllAvatar } from '@/features/agents/views/agent-all-avatar';
import { AgentRailList } from '@/features/agents/views/agent-rail-list';
import { translate } from '@/shared/i18n/translate';
import { isWindowsPlatform } from '@/shared/lib/is-windows-platform';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { IconButton } from '@/shared/views/icon-button';
import { LogoIcon } from '@/shared/views/logo-icon';
import { ScrollArea } from '@/shared/views/scroll-area';
import { Separator } from '@/shared/views/separator';
import { Tooltip } from '@/shared/views/tooltip';
import { openCreateAgentDialog } from '@/windows/main-window/actions/open-create-agent-dialog';
import { openDeleteAgentDialog } from '@/windows/main-window/actions/open-delete-agent-dialog';
import { openEditAgentDialog } from '@/windows/main-window/actions/open-edit-agent-dialog';
import { openGatewaysManagerDialog } from '@/windows/main-window/actions/open-gateways-manager-dialog';
import { startNewConversation } from '@/windows/main-window/actions/start-new-conversation';
import {
  useMainWindowUiStore,
  type MainWindowUiState,
} from '@/windows/main-window/stores/main-window-ui-store';
import { SidebarToggleButton } from '@/windows/main-window/views/sidebar-toggle-button';
import { openWindow } from '@/windows/registry';
import { WindowKind } from '@/windows/window-kind';

export const AgentRail = (): React.ReactElement => {
  const agentFilter = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['agentFilter'] => state.agentFilter,
  );
  const setAgentFilter = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['setAgentFilter'] => state.setAgentFilter,
  );
  const setIsSidebarCollapsed = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['setIsSidebarCollapsed'] =>
      state.setIsSidebarCollapsed,
  );
  const isSidebarCollapsed = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['isSidebarCollapsed'] => state.isSidebarCollapsed,
  );

  const isAllSelected = agentFilter === null;
  const isWindows = isWindowsPlatform();

  const selectAgentAndOpenSidebar = (agentId: string | null): void => {
    setAgentFilter(agentId);
    setIsSidebarCollapsed(false);
  };

  return (
    <aside
      className="relative bg-rail border-r border-subtle flex flex-col items-center shrink-0"
      style={{ width: 'var(--rail-width)' }}
    >
      {isWindows ? (
        // Absolute drag strip over the top 40px of the rail — replaces the
        // Mac safe-area that we no longer render (logo would be pushed too
        // far down) and gives Windows users a draggable region on the left
        // side. Sits over the LogoIcon which is non-interactive.
        <div
          data-tauri-drag-region
          aria-hidden
          className="absolute top-0 left-0 w-full pointer-events-auto z-10"
          style={{ height: 'var(--titlebar-safe-area)' }}
        />
      ) : (
        <div
          data-tauri-drag-region
          aria-hidden
          className="w-full shrink-0"
          style={{ height: 'var(--titlebar-safe-area)' }}
        />
      )}
      <div
        className={mergeClasses(
          'w-full flex flex-col items-center gap-2.5 px-2 shrink-0',
          isWindows ? 'pt-5' : null,
        )}
      >
        <LogoIcon size={32} />

        <Separator className="w-7" />

        <Tooltip content={translate('agents.addTooltip')}>
          <button
            type="button"
            aria-label={translate('agents.addTooltip')}
            onClick={(): void => {
              openCreateAgentDialog();
            }}
            className="block focus-visible:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-rail)]"
          >
            <div className="flex items-center justify-center rounded-full bg-[var(--bg-active)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors h-10 w-10">
              <Plus size={18} strokeWidth={2.1} />
            </div>
          </button>
        </Tooltip>

        <Separator className="w-7" />

        <ul
          role="listbox"
          aria-label={translate('agents.all')}
          className="flex flex-col items-center gap-2.5 w-full"
        >
          <li
            role="option"
            aria-selected={isAllSelected}
            className="flex items-center justify-center"
          >
            <Tooltip content={translate('agents.all')}>
              <button
                type="button"
                aria-label={translate('agents.all')}
                onClick={(): void => {
                  selectAgentAndOpenSidebar(null);
                }}
                className="block focus-visible:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-rail)]"
              >
                <AgentAllAvatar size={40} isSelected={isAllSelected} />
              </button>
            </Tooltip>
          </li>
        </ul>

        <Separator className="w-7" />
      </div>

      <ScrollArea className="flex-1 w-full">
        <AgentRailList
          agentFilter={agentFilter}
          onSelectAgent={selectAgentAndOpenSidebar}
          onEdit={openEditAgentDialog}
          onDelete={openDeleteAgentDialog}
        />
      </ScrollArea>

      <div className="w-full px-2 pt-1 pb-3 flex flex-col items-center gap-1">
        {isSidebarCollapsed ? (
          <Tooltip content={translate('conversations.newButton')}>
            <IconButton
              ariaLabel={translate('conversations.newButton')}
              size="md"
              onClick={(): void => {
                void startNewConversation(agentFilter);
              }}
            >
              <MessageSquarePlus size={17} strokeWidth={1.9} />
            </IconButton>
          </Tooltip>
        ) : null}
        <SidebarToggleButton />
        <Tooltip content={translate('gateways.tooltip')}>
          <IconButton
            ariaLabel={translate('gateways.tooltip')}
            size="md"
            onClick={(): void => {
              openGatewaysManagerDialog();
            }}
          >
            <Cable size={17} strokeWidth={1.9} />
          </IconButton>
        </Tooltip>
        <Tooltip content={translate('agents.settingsTooltip')}>
          <IconButton
            ariaLabel={translate('agents.settingsTooltip')}
            size="md"
            onClick={(): void => {
              void openWindow(WindowKind.Settings);
            }}
          >
            <Settings size={17} strokeWidth={1.9} />
          </IconButton>
        </Tooltip>
      </div>
    </aside>
  );
};
