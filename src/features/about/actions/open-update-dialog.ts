import { useAboutStore } from '@/features/about/stores/about-store';

export function openUpdateDialog(): void {
  useAboutStore.getState().setIsDialogOpen(true);
}
