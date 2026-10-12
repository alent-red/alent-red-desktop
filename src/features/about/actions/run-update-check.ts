import { check } from '@tauri-apps/plugin-updater';

import { broadcastUpdateFound } from '@/features/about/actions/broadcast-update-found';
import { useAboutStore } from '@/features/about/stores/about-store';
import type { UpdateInfo } from '@/features/about/types/update-info';

const THROTTLE_MS = 60 * 60 * 1000;

interface RunUpdateCheckOptions {
  ignoreCadence?: boolean;
}

interface RunUpdateCheckResult {
  found: UpdateInfo | null;
  skipped: boolean;
}

function toUpdateInfo(update: {
  currentVersion: string;
  version: string;
  body?: string;
}): UpdateInfo {
  return {
    version: update.version,
    currentVersion: update.currentVersion,
    notes: update.body ?? null,
  };
}

export async function runUpdateCheck(
  options?: RunUpdateCheckOptions,
): Promise<RunUpdateCheckResult> {
  const ignoreCadence = options?.ignoreCadence === true;
  const store = useAboutStore.getState();

  if (!ignoreCadence) {
    const sinceLast = Date.now() - store.lastCheckAt;
    if (sinceLast < THROTTLE_MS) {
      return { found: null, skipped: true };
    }
  }

  if (store.isChecking) {
    return { found: null, skipped: true };
  }

  store.setIsChecking(true);
  try {
    const result = await check();
    store.setLastCheckAt(Date.now());
    if (result === null) {
      return { found: null, skipped: false };
    }
    const info = toUpdateInfo(result);
    await result.close();
    store.setPendingUpdate(info);
    await broadcastUpdateFound(info);
    return { found: info, skipped: false };
  } finally {
    store.setIsChecking(false);
  }
}
