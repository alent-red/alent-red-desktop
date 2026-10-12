import { useAboutStore } from '@/features/about/stores/about-store';

export function closeUpdateDialog(): void {
  useAboutStore.getState().setIsDialogOpen(false);
}
