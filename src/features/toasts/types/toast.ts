import type { ToastVariant } from '@/features/toasts/types/toast-variant';

export interface Toast {
  id: string;
  title: string;
  description: string | null;
  variant: ToastVariant;
  durationMs: number;
  action: { label: string; onSelect: () => void } | null;
}
