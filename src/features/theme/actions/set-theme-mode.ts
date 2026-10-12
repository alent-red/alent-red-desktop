import { useThemeStore } from '@/features/theme/stores/theme-store';
import type { ThemeMode } from '@/features/theme/types/theme-mode';

export function setThemeMode(mode: ThemeMode): void {
  useThemeStore.getState().setMode(mode);
}
