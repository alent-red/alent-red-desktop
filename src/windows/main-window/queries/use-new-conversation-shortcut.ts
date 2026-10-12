import * as React from 'react';

import { startNewConversation } from '@/windows/main-window/actions/start-new-conversation';
import { useMainWindowUiStore } from '@/windows/main-window/stores/main-window-ui-store';

// Cmd+N on macOS, Ctrl+N elsewhere: same path as the "+" button.
export function useNewConversationShortcut(): void {
  React.useEffect((): (() => void) => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key.toLowerCase() !== 'n' || event.repeat) {
        return;
      }
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }
      event.preventDefault();
      void startNewConversation(useMainWindowUiStore.getState().agentFilter);
    };
    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
