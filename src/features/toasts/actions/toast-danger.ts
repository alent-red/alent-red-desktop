import { useToastStore } from '@/features/toasts/stores/toast-store';
import { ToastVariant } from '@/features/toasts/types/toast-variant';

export function toastDanger(title: string, description: string | null = null): void {
  useToastStore.getState().push({
    variant: ToastVariant.Danger,
    title,
    description,
    action: null,
  });
}
