import { useAboutStore } from '@/features/about/stores/about-store';

export function dismissFab(): void {
  useAboutStore.getState().setIsFabDismissed(true);
}
