import * as React from 'react';

import {
  Boxes,
  Cpu,
  Info,
  Palette,
  Server,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react';

import { UpdateDialog } from '@/features/about/views/update-dialog';
import { translate, type TranslationKey } from '@/shared/i18n/translate';
import { assertNever } from '@/shared/lib/assert-never';
import { mergeClasses } from '@/shared/lib/merge-classes';
import {
  useSettingsWindowUiStore,
  type SettingsWindowUiState,
} from '@/windows/settings-window/stores/settings-window-ui-store';
import { SettingsTab } from '@/windows/settings-window/types/settings-tab';
import { AboutView } from '@/windows/settings-window/views/about-view';
import { AppearanceView } from '@/windows/settings-window/views/appearance-view';
import { BricksView } from '@/windows/settings-window/views/bricks-view';
import { LlmModelsView } from '@/windows/settings-window/views/llm-models-view';
import { PreferencesView } from '@/windows/settings-window/views/preferences-view';
import { ProvidersView } from '@/windows/settings-window/views/providers-view';
import { SettingsWindowDialogs } from '@/windows/settings-window/views/settings-window-dialogs';

interface TabEntry {
  value: SettingsTab;
  labelKey: TranslationKey;
  icon: LucideIcon;
}

const TABS: TabEntry[] = [
  { value: SettingsTab.Providers, labelKey: 'settings.tabProviders', icon: Server },
  { value: SettingsTab.Models, labelKey: 'settings.tabModels', icon: Cpu },
  { value: SettingsTab.Bricks, labelKey: 'settings.tabBricks', icon: Boxes },
  { value: SettingsTab.Preferences, labelKey: 'settings.tabPreferences', icon: SettingsIcon },
  { value: SettingsTab.Appearance, labelKey: 'settings.tabAppearance', icon: Palette },
  { value: SettingsTab.About, labelKey: 'settings.tabAbout', icon: Info },
];

const renderTabContent = (tab: SettingsTab): React.ReactElement => {
  switch (tab) {
    case SettingsTab.Appearance:
      return <AppearanceView />;
    case SettingsTab.Providers:
      return <ProvidersView />;
    case SettingsTab.Models:
      return <LlmModelsView />;
    case SettingsTab.Bricks:
      return <BricksView />;
    case SettingsTab.Preferences:
      return <PreferencesView />;
    case SettingsTab.About:
      return <AboutView />;
    default:
      return assertNever(tab);
  }
};

export const SettingsWindow = (): React.ReactElement => {
  const tab = useSettingsWindowUiStore(
    (state: SettingsWindowUiState): SettingsWindowUiState['settingsTab'] => state.settingsTab,
  );
  const setTab = useSettingsWindowUiStore(
    (state: SettingsWindowUiState): SettingsWindowUiState['setSettingsTab'] => state.setSettingsTab,
  );

  return (
    <>
      <div className="h-full w-full flex select-none">
        <aside className="w-[200px] shrink-0 bg-rail border-r border-subtle flex flex-col">
          <div
            data-tauri-drag-region
            aria-hidden
            className="w-full"
            style={{ height: 'var(--titlebar-safe-area)' }}
          />
          <div className="px-3 pt-1 pb-3">
            <div className="text-[12px] font-semibold text-muted uppercase tracking-wider px-2 pb-2.5">
              {translate('settings.title')}
            </div>
            <nav className="flex flex-col gap-0.5">
              {TABS.map((entry): React.ReactElement => {
                const IconComponent = entry.icon;
                const isActive = tab === entry.value;
                return (
                  <button
                    key={entry.value}
                    type="button"
                    onClick={(): void => {
                      setTab(entry.value);
                    }}
                    className={mergeClasses(
                      'flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-[13px]',
                      'transition-colors duration-[140ms]',
                      isActive
                        ? 'bg-[var(--bg-selected)] text-[var(--color-brand)] font-medium'
                        : 'text-secondary hover:bg-[var(--bg-hover)] hover:text-primary',
                    )}
                  >
                    <IconComponent size={14} />
                    {translate(entry.labelKey)}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0 flex flex-col bg-surface">
          <div
            data-tauri-drag-region
            aria-hidden
            className="w-full"
            style={{ height: 'var(--titlebar-safe-area)' }}
          />
          <div className="flex-1 min-h-0 overflow-hidden">{renderTabContent(tab)}</div>
        </main>
      </div>
      <SettingsWindowDialogs />
      <UpdateDialog />
    </>
  );
};
