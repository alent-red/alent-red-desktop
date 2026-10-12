export const ToastVariant = {
  Info: 'INFO',
  Success: 'SUCCESS',
  Warning: 'WARNING',
  Danger: 'DANGER',
} as const;
export type ToastVariant = (typeof ToastVariant)[keyof typeof ToastVariant];
