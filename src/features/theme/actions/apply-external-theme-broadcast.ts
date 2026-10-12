import { useThemeStore } from '@/features/theme/stores/theme-store';
import type { ThemeMode } from '@/features/theme/types/theme-mode';

export function applyExternalThemeBroadcast(mode: ThemeMode): void {
  useThemeStore.getState().setMode(mode, { broadcast: false });
}
