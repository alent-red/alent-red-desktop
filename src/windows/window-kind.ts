export const WindowKind = {
  Main: 'MAIN',
  Settings: 'SETTINGS',
} as const;
export type WindowKind = (typeof WindowKind)[keyof typeof WindowKind];
