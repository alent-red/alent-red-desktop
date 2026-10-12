import { emit } from '@tauri-apps/api/event';

import { UPDATE_FOUND_EVENT } from '@/features/about/events/update-found-event';
import type { UpdateInfo } from '@/features/about/types/update-info';

export async function broadcastUpdateFound(update: UpdateInfo): Promise<void> {
  await emit(UPDATE_FOUND_EVENT, update);
}
