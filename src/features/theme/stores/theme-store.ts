import { emit } from '@tauri-apps/api/event';
import { create } from 'zustand';

import { THEME_CHANGED_EVENT } from '@/features/theme/events/theme-changed-event';
import { ResolvedTheme } from '@/features/theme/types/resolved-theme';
import { ThemeMode } from '@/features/theme/types/theme-mode';

export interface ThemeState {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode, options?: { broadcast?: boolean }) => void;
}

const STORAGE_KEY = 'alent-red:theme-mode';
const PREFERS_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

let systemListener: ((event: MediaQueryListEvent) => void) | null = null;

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return ThemeMode.System;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === ThemeMode.Light || stored === ThemeMode.Dark || stored === ThemeMode.System) {
    return stored;
  }
  return ThemeMode.System;
}

function detectSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return ResolvedTheme.Light;
  }
  return window.matchMedia(PREFERS_DARK_MEDIA_QUERY).matches
    ? ResolvedTheme.Dark
    : ResolvedTheme.Light;
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === ThemeMode.System) {
    return detectSystemTheme();
  }
  return mode === ThemeMode.Dark ? ResolvedTheme.Dark : ResolvedTheme.Light;
}

function applyTheme(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.dataset['theme'] = resolved === ResolvedTheme.Dark ? 'dark' : 'light';
}

function attachSystemListener(callback: (resolved: ResolvedTheme) => void): void {
  if (typeof window === 'undefined' || systemListener !== null) {
    return;
  }
  const media = window.matchMedia(PREFERS_DARK_MEDIA_QUERY);
  systemListener = (event): void => {
    callback(event.matches ? ResolvedTheme.Dark : ResolvedTheme.Light);
  };
  media.addEventListener('change', systemListener);
}

function detachSystemListener(): void {
  if (typeof window === 'undefined' || systemListener === null) {
    return;
  }
  window.matchMedia(PREFERS_DARK_MEDIA_QUERY).removeEventListener('change', systemListener);
  systemListener = null;
}

export const useThemeStore = create<ThemeState>((set): ThemeState => {
  const initialMode = readStoredMode();
  const initialResolved = resolveTheme(initialMode);
  applyTheme(initialResolved);

  if (initialMode === ThemeMode.System) {
    attachSystemListener((resolved): void => {
      applyTheme(resolved);
      set({ resolved });
    });
  }

  return {
    mode: initialMode,
    resolved: initialResolved,

    setMode: (mode, options): void => {
      window.localStorage.setItem(STORAGE_KEY, mode);
      const resolved = resolveTheme(mode);
      applyTheme(resolved);
      if (mode === ThemeMode.System) {
        attachSystemListener((next): void => {
          applyTheme(next);
          set({ resolved: next });
        });
      } else {
        detachSystemListener();
      }
      set({ mode, resolved });

      if (options?.broadcast !== false) {
        void emit(THEME_CHANGED_EVENT, mode);
      }
    },
  };
});
