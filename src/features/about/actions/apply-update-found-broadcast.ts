import { useAboutStore } from '@/features/about/stores/about-store';
import type { UpdateInfo } from '@/features/about/types/update-info';

export function applyUpdateFoundBroadcast(update: UpdateInfo): void {
  const current = useAboutStore.getState().pendingUpdate;
  if (current !== null && current.version === update.version) {
    return;
  }
  useAboutStore.getState().setPendingUpdate(update);
}
