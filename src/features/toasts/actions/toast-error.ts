import { useToastStore } from '@/features/toasts/stores/toast-store';
import { ToastVariant } from '@/features/toasts/types/toast-variant';
import { presentError } from '@/shared/lib/present-error';

export function toastError(error: unknown): void {
  const presented = presentError(error);
  useToastStore.getState().push({
    variant: ToastVariant.Danger,
    title: presented.title,
    description: presented.detail,
    action: null,
  });
}
