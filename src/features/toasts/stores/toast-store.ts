import { create } from 'zustand';

import type { Toast } from '@/features/toasts/types/toast';

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id' | 'durationMs'> & { durationMs?: number }) => string;
  dismiss: (id: string) => void;
}

const DEFAULT_TOAST_DURATION_MS = 5000;

let toastCounter = 0;
function computeNextToastId(): string {
  toastCounter += 1;
  return `toast-${String(Date.now())}-${String(toastCounter)}`;
}

export const useToastStore = create<ToastState>(
  (set): ToastState => ({
    toasts: [],
    push: ({ durationMs = DEFAULT_TOAST_DURATION_MS, ...rest }): string => {
      const id = computeNextToastId();
      set((state): { toasts: Toast[] } => ({
        toasts: [...state.toasts, { id, durationMs, ...rest }],
      }));
      if (durationMs > 0) {
        window.setTimeout((): void => {
          set((state): { toasts: Toast[] } => ({
            toasts: state.toasts.filter((toast): boolean => toast.id !== id),
          }));
        }, durationMs);
      }
      return id;
    },
    dismiss: (id): void => {
      set((state): { toasts: Toast[] } => ({
        toasts: state.toasts.filter((toast): boolean => toast.id !== id),
      }));
    },
  }),
);
