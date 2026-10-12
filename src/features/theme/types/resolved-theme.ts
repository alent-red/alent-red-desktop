export const ResolvedTheme = {
  Light: 'LIGHT',
  Dark: 'DARK',
} as const;
export type ResolvedTheme = (typeof ResolvedTheme)[keyof typeof ResolvedTheme];
