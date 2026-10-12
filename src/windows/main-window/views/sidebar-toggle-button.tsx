import * as React from 'react';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { IconButton } from '@/shared/views/icon-button';
import { Tooltip } from '@/shared/views/tooltip';
import {
  useMainWindowUiStore,
  type MainWindowUiState,
} from '@/windows/main-window/stores/main-window-ui-store';

export const SidebarToggleButton = (): React.ReactElement => {
  const isCollapsed = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['isSidebarCollapsed'] => state.isSidebarCollapsed,
  );
  const setIsCollapsed = useMainWindowUiStore(
    (state: MainWindowUiState): MainWindowUiState['setIsSidebarCollapsed'] =>
      state.setIsSidebarCollapsed,
  );

  const labelKey = isCollapsed ? 'mainWindow.openSidebar' : 'mainWindow.closeSidebar';
  const label = translate(labelKey);

  const handleToggle = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Tooltip content={label} side="right">
      <IconButton ariaLabel={label} size="md" onClick={handleToggle}>
        {isCollapsed ? (
          <PanelLeftOpen size={17} strokeWidth={1.9} />
        ) : (
          <PanelLeftClose size={17} strokeWidth={1.9} />
        )}
      </IconButton>
    </Tooltip>
  );
};
