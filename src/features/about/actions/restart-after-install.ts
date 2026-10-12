import { relaunch } from '@tauri-apps/plugin-process';

export async function restartAfterInstall(): Promise<void> {
  await relaunch();
}
