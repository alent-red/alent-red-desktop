import { check } from '@tauri-apps/plugin-updater';

import { InstallPhase, useAboutStore } from '@/features/about/stores/about-store';

export async function installPendingUpdate(): Promise<void> {
  const store = useAboutStore.getState();

  store.setInstallPhase(InstallPhase.Downloading);
  store.setDownloadProgress(0, 0);

  try {
    const update = await check();
    if (update === null) {
      store.resetInstallState();
      throw new Error('Update no longer available');
    }

    let totalBytes = 0;
    let downloadedBytes = 0;

    await update.downloadAndInstall((event): void => {
      switch (event.event) {
        case 'Started':
          totalBytes = event.data.contentLength ?? 0;
          downloadedBytes = 0;
          store.setDownloadProgress(downloadedBytes, totalBytes);
          break;
        case 'Progress':
          downloadedBytes += event.data.chunkLength;
          store.setDownloadProgress(downloadedBytes, totalBytes);
          break;
        case 'Finished':
          store.setInstallPhase(InstallPhase.Installing);
          break;
        default:
          break;
      }
    });

    await update.close();
    store.setInstallPhase(InstallPhase.ReadyToRestart);
  } catch (caught) {
    store.resetInstallState();
    throw caught;
  }
}
