import * as React from 'react';

import { useThemeStore, type ThemeState } from '@/features/theme/stores/theme-store';
import { ResolvedTheme } from '@/features/theme/types/resolved-theme';
import logoDarkUrl from '@/shared/assets/logo-dark.png';
import logoLightUrl from '@/shared/assets/logo-light.png';

interface LogoProps {
  size: number;
}

const NATURAL_WIDTH = 3169;
const NATURAL_HEIGHT = 600;

export const Logo = ({ size }: LogoProps): React.ReactElement => {
  const resolved = useThemeStore((state: ThemeState): ThemeState['resolved'] => state.resolved);
  const source = resolved === ResolvedTheme.Dark ? logoDarkUrl : logoLightUrl;
  const width = Math.round((size * NATURAL_WIDTH) / NATURAL_HEIGHT);
  return <img src={source} alt="Alent.Red" width={width} height={size} draggable={false} />;
};
