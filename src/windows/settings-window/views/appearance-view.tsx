import * as React from 'react';

import { setThemeMode } from '@/features/theme/actions/set-theme-mode';
import { THEME_OPTIONS } from '@/features/theme/constants/theme-options';
import { useThemeStore } from '@/features/theme/stores/theme-store';
import { type ThemeMode } from '@/features/theme/types/theme-mode';
import { ThemeCard } from '@/features/theme/views/theme-card';
import { setIsAlwaysOnTop } from '@/features/window-behavior/actions/set-is-always-on-top';
import { setIsContentProtected } from '@/features/window-behavior/actions/set-is-content-protected';
import { isLinuxPlatform } from '@/features/window-behavior/lib/is-linux-platform';
import {
  useWindowBehaviorStore,
  type WindowBehaviorState,
} from '@/features/window-behavior/stores/window-behavior-store';
import { WindowBehaviorToggleRow } from '@/features/window-behavior/views/window-behavior-toggle-row';
import { translate } from '@/shared/i18n/translate';
import { ScrollArea } from '@/shared/views/scroll-area';

export const AppearanceView = (): React.ReactElement => {
  const mode = useThemeStore((state): ThemeMode => state.mode);
  const isAlwaysOnTop = useWindowBehaviorStore(
    (state: WindowBehaviorState): WindowBehaviorState['isAlwaysOnTop'] => state.isAlwaysOnTop,
  );
  const isContentProtected = useWindowBehaviorStore(
    (state: WindowBehaviorState): WindowBehaviorState['isContentProtected'] =>
      state.isContentProtected,
  );
  const isOnLinux = isLinuxPlatform();

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-6 pb-3 border-b border-subtle">
        <h2 className="text-[14.5px] font-semibold tracking-tight">
          {translate('appearance.title')}
        </h2>
      </header>
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 max-w-[640px] flex flex-col gap-6">
          <section className="flex flex-col gap-2.5">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              {translate('appearance.themeSection')}
            </div>
            <div
              role="radiogroup"
              aria-label={translate('appearance.themeSection')}
              className="grid grid-cols-3 gap-2"
            >
              {THEME_OPTIONS.map(
                (option): React.ReactElement => (
                  <ThemeCard
                    key={option.value}
                    option={option}
                    isSelected={mode === option.value}
                    onSelect={(): void => {
                      setThemeMode(option.value);
                    }}
                  />
                ),
              )}
            </div>
          </section>
          <section className="flex flex-col gap-1">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider pb-1.5">
              {translate('appearance.windowSection')}
            </div>
            <WindowBehaviorToggleRow
              label={translate('appearance.alwaysOnTopLabel')}
              description={translate('appearance.alwaysOnTopDescription')}
              isChecked={isAlwaysOnTop}
              onChange={setIsAlwaysOnTop}
            />
            {isOnLinux ? (
              <WindowBehaviorToggleRow
                label={translate('appearance.contentProtectedLabel')}
                description={translate('appearance.contentProtectedDescription')}
                isChecked={isContentProtected}
                isDisabled
                disabledTooltip={translate('appearance.contentProtectedLinuxUnavailable')}
                onChange={setIsContentProtected}
              />
            ) : (
              <WindowBehaviorToggleRow
                label={translate('appearance.contentProtectedLabel')}
                description={translate('appearance.contentProtectedDescription')}
                isChecked={isContentProtected}
                onChange={setIsContentProtected}
              />
            )}
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};
