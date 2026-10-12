import { useAboutStore } from '@/features/about/stores/about-store';
import type { UpdateInfo } from '@/features/about/types/update-info';

export function setPendingUpdate(update: UpdateInfo | null): void {
  useAboutStore.getState().setPendingUpdate(update);
}
