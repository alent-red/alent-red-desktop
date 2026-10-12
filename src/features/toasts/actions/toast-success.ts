import { useToastStore } from '@/features/toasts/stores/toast-store';
import { ToastVariant } from '@/features/toasts/types/toast-variant';

export function toastSuccess(title: string, description: string | null = null): void {
  useToastStore.getState().push({
    variant: ToastVariant.Success,
    title,
    description,
    action: null,
  });
}
