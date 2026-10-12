import React from 'react';

import ReactDOM from 'react-dom/client';

import '@/shared/styles/globals.css';
import { SettingsWindow } from '@/windows/settings-window/settings-window';
import { WindowShell } from '@/windows/window-shell';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element with id "root" was not found in settings.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <WindowShell>
      <SettingsWindow />
    </WindowShell>
  </React.StrictMode>,
);
