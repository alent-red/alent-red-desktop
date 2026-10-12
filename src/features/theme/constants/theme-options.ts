import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';

import { ThemeMode } from '@/features/theme/types/theme-mode';
import { translate } from '@/shared/i18n/translate';

export interface ThemeOption {
  value: ThemeMode;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: ThemeMode.System,
    label: translate('appearance.themeSystemLabel'),
    description: translate('appearance.themeSystemDescription'),
    icon: Monitor,
  },
  {
    value: ThemeMode.Light,
    label: translate('appearance.themeLightLabel'),
    description: translate('appearance.themeLightDescription'),
    icon: Sun,
  },
  {
    value: ThemeMode.Dark,
    label: translate('appearance.themeDarkLabel'),
    description: translate('appearance.themeDarkDescription'),
    icon: Moon,
  },
];
