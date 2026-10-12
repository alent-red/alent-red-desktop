import * as React from 'react';

import { LogicalSize } from '@tauri-apps/api/dpi';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

import { toastError } from '@/features/toasts/actions/toast-error';
import {
  useMainWindowUiStore,
  type MainWindowUiState,
} from '@/windows/main-window/stores/main-window-ui-store';

// Window minimum size per sidebar state. Mirrors tauri.conf.json's static
// floor for the collapsed case (500x500); the open case raises the floor so
// the conversations panel + chat have room to breathe. Applied on mount AND
// on every transition — Tauri does not persist setMinSize across launches,
// so each launch starts at the config floor (500x500) and we have to push
// the runtime floor back up if the user was open at quit time.
const MIN_OPEN_WIDTH_PX = 700;
const MIN_OPEN_HEIGHT_PX = 500;
const MIN_COLLAPSED_WIDTH_PX = 500;
const MIN_COLLAPSED_HEIGHT_PX = 500;

export function useSidebarMinSizeApplier(): void {
  const isSidebarCollapsed = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['isSidebarCollapsed'] => state.isSidebarCollapsed,
  );

  React.useEffect((): void => {
    const window = getCurrentWebviewWindow();
    const nextSize = isSidebarCollapsed
      ? new LogicalSize(MIN_COLLAPSED_WIDTH_PX, MIN_COLLAPSED_HEIGHT_PX)
      : new LogicalSize(MIN_OPEN_WIDTH_PX, MIN_OPEN_HEIGHT_PX);

    window.setMinSize(nextSize).catch((caught: unknown): void => {
      toastError(caught);
    });
  }, [isSidebarCollapsed]);
}
