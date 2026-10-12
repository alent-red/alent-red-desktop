import { LogicalPosition } from '@tauri-apps/api/dpi';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

import { translate } from '@/shared/i18n/translate';
import { isWindowsPlatform } from '@/shared/lib/is-windows-platform';
import { WindowKind } from '@/windows/window-kind';

interface WindowDefinition {
  label: string;
  url: string;
  title: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

const SETTINGS_DEFINITION: WindowDefinition = {
  label: 'settings',
  url: 'settings.html',
  title: translate('settings.title'),
  width: 920,
  height: 640,
  minWidth: 720,
  minHeight: 540,
};

const TRAFFIC_LIGHT_POSITION_X = 16;
const TRAFFIC_LIGHT_POSITION_Y = 18;

export async function openWindow(kind: WindowKind): Promise<void> {
  if (kind === WindowKind.Main) {
    throw new Error('Main window cannot be opened dynamically; it is created at app launch.');
  }
  const definition = SETTINGS_DEFINITION;
  const existing = await WebviewWindow.getByLabel(definition.label);
  if (existing !== null) {
    await existing.show();
    await existing.setFocus();
    return;
  }
  const isWindows = isWindowsPlatform();
  new WebviewWindow(definition.label, {
    url: definition.url,
    title: definition.title,
    width: definition.width,
    height: definition.height,
    minWidth: definition.minWidth,
    minHeight: definition.minHeight,
    decorations: !isWindows,
    hiddenTitle: !isWindows,
    resizable: true,
    center: true,
    trafficLightPosition: new LogicalPosition(TRAFFIC_LIGHT_POSITION_X, TRAFFIC_LIGHT_POSITION_Y),
    ...(isWindows ? {} : { titleBarStyle: 'overlay' as const }),
  });
}
