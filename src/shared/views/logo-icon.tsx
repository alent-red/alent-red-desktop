import * as React from 'react';

import { useThemeStore, type ThemeState } from '@/features/theme/stores/theme-store';
import { ResolvedTheme } from '@/features/theme/types/resolved-theme';
import iconDarkUrl from '@/shared/assets/icon-dark.png';
import iconLightUrl from '@/shared/assets/icon-light.png';

interface LogoIconProps {
  size: number;
}

const NATURAL_WIDTH = 373;
const NATURAL_HEIGHT = 400;

export const LogoIcon = ({ size }: LogoIconProps): React.ReactElement => {
  const resolved = useThemeStore((state: ThemeState): ThemeState['resolved'] => state.resolved);
  const source = resolved === ResolvedTheme.Dark ? iconDarkUrl : iconLightUrl;
  const width = Math.round((size * NATURAL_WIDTH) / NATURAL_HEIGHT);
  return <img src={source} alt="Alent.Red" width={width} height={size} draggable={false} />;
};
