import React from 'react';

import ReactDOM from 'react-dom/client';

import '@/shared/styles/globals.css';
import { MainWindow } from '@/windows/main-window/main-window';
import { WindowShell } from '@/windows/window-shell';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Root element with id "root" was not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <WindowShell>
      <MainWindow />
    </WindowShell>
  </React.StrictMode>,
);
