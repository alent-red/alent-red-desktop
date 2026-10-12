import { useToastStore } from '@/features/toasts/stores/toast-store';
import { ToastVariant } from '@/features/toasts/types/toast-variant';

export function toastWarning(title: string, description: string | null = null): void {
  useToastStore.getState().push({
    variant: ToastVariant.Warning,
    title,
    description,
    action: null,
  });
}
