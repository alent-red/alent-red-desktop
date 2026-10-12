import * as React from 'react';

import { useUpdateWatcher } from '@/features/about/queries/use-update-watcher';
import { UpdateDialog } from '@/features/about/views/update-dialog';
import { UpdateFab } from '@/features/about/views/update-fab';
import { arePermissionsGranted } from '@/features/permissions/lib/are-permissions-granted';
import { usePermissionsStatus } from '@/features/permissions/queries/use-permissions-status';
import { useSignupStore, type SignupState } from '@/features/signup/stores/signup-store';
import { SignupGate } from '@/features/signup/views/signup-gate';
import { PanelResizer } from '@/shared/views/panel-resizer';
import { useNewConversationShortcut } from '@/windows/main-window/queries/use-new-conversation-shortcut';
import { useSidebarMinSizeApplier } from '@/windows/main-window/queries/use-sidebar-min-size-applier';
import {
  useMainWindowOnboardingStore,
  type MainWindowOnboardingState,
} from '@/windows/main-window/stores/main-window-onboarding-store';
import {
  useMainWindowUiStore,
  type MainWindowUiState,
} from '@/windows/main-window/stores/main-window-ui-store';
import { AgentRail } from '@/windows/main-window/views/agent-rail';
import { ChatView } from '@/windows/main-window/views/chat-view';
import { ConversationsListView } from '@/windows/main-window/views/conversations-list-view';
import { MainWindowDialogs } from '@/windows/main-window/views/main-window-dialogs';
import { Onboarding } from '@/windows/main-window/views/onboarding/onboarding';
import { PermissionsRequiredGate } from '@/windows/main-window/views/onboarding/permissions-required-gate';

const SIDEBAR_TRANSITION_MS = 200;

export const MainWindow = (): React.ReactElement => {
  const isSignedIn = useSignupStore(
    (state: SignupState): SignupState['isSignedIn'] => state.isSignedIn,
  );
  const isOnboardingComplete = useMainWindowOnboardingStore(
    (state: MainWindowOnboardingState): MainWindowOnboardingState['isComplete'] => state.isComplete,
  );
  const permissionsStatusQuery = usePermissionsStatus();

  useUpdateWatcher();

  if (!isSignedIn) {
    return <SignupGate />;
  }
  if (!isOnboardingComplete) {
    return <Onboarding />;
  }
  if (
    permissionsStatusQuery.data !== undefined &&
    !arePermissionsGranted(permissionsStatusQuery.data)
  ) {
    return <PermissionsRequiredGate />;
  }
  return <MainWindowContent />;
};

const MainWindowContent = (): React.ReactElement => {
  const conversationsPanelWidth = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['conversationsPanelWidth'] =>
      state.conversationsPanelWidth,
  );
  const setConversationsPanelWidth = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['setConversationsPanelWidth'] =>
      state.setConversationsPanelWidth,
  );
  const isSidebarCollapsed = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['isSidebarCollapsed'] => state.isSidebarCollapsed,
  );

  useSidebarMinSizeApplier();
  useNewConversationShortcut();

  const conversationsAsideWidthPx = isSidebarCollapsed ? 0 : conversationsPanelWidth;

  return (
    <>
      <div className="h-full w-full flex select-none">
        <AgentRail />
        <aside
          className="flex flex-col bg-panel border-r border-subtle shrink-0 overflow-hidden"
          style={{
            width: `${String(conversationsAsideWidthPx)}px`,
            transition: `width ${String(SIDEBAR_TRANSITION_MS)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
          aria-hidden={isSidebarCollapsed}
        >
          <ConversationsListView />
        </aside>
        {isSidebarCollapsed ? null : (
          <PanelResizer width={conversationsPanelWidth} onChange={setConversationsPanelWidth} />
        )}
        <main className="flex-1 min-w-0 flex flex-col bg-surface">
          <ChatView />
        </main>
      </div>
      <MainWindowDialogs />
      <UpdateFab />
      <UpdateDialog />
    </>
  );
};
