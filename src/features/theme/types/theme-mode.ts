export const ThemeMode = {
  Light: 'LIGHT',
  Dark: 'DARK',
  System: 'SYSTEM',
} as const;
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];
