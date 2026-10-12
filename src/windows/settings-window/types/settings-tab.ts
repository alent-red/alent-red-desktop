export const SettingsTab = {
  Providers: 'PROVIDERS',
  Models: 'MODELS',
  Bricks: 'BRICKS',
  Preferences: 'PREFERENCES',
  Appearance: 'APPEARANCE',
  About: 'ABOUT',
} as const;
export type SettingsTab = (typeof SettingsTab)[keyof typeof SettingsTab];
