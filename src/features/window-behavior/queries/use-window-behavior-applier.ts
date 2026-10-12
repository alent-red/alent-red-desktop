import * as React from 'react';

import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import { toastError } from '@/features/toasts/actions/toast-error';
import { isLinuxPlatform } from '@/features/window-behavior/lib/is-linux-platform';
import {
  useWindowBehaviorStore,
  type WindowBehaviorState,
} from '@/features/window-behavior/stores/window-behavior-store';

// Subscribes to the window-behavior store and applies the current values to
// THIS window's webview. Runs once at mount, then on every store change.
// Each window mounts this hook independently — there's no cross-window call
// from one window to the other; sync happens through the broadcast event
// which both stores already listen to.
export function useWindowBehaviorApplier(): void {
  const isAlwaysOnTop = useWindowBehaviorStore(
    (state: WindowBehaviorState): WindowBehaviorState['isAlwaysOnTop'] => state.isAlwaysOnTop,
  );
  const isContentProtected = useWindowBehaviorStore(
    (state: WindowBehaviorState): WindowBehaviorState['isContentProtected'] =>
      state.isContentProtected,
  );

  React.useEffect((): void => {
    const window = getCurrentWebviewWindow();
    window.setAlwaysOnTop(isAlwaysOnTop).catch((caught: unknown): void => {
      toastError(caught);
    });
  }, [isAlwaysOnTop]);

  React.useEffect((): void => {
    if (isLinuxPlatform()) {
      return;
    }
    const window = getCurrentWebviewWindow();
    window.setContentProtected(isContentProtected).catch((caught: unknown): void => {
      toastError(caught);
    });
  }, [isContentProtected]);
}
