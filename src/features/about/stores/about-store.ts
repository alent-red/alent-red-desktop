import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { UpdateInfo } from '@/features/about/types/update-info';

export const InstallPhase = {
  Idle: 'IDLE',
  Downloading: 'DOWNLOADING',
  Installing: 'INSTALLING',
  ReadyToRestart: 'READY_TO_RESTART',
} as const;
export type InstallPhase = (typeof InstallPhase)[keyof typeof InstallPhase];

export interface AboutState {
  pendingUpdate: UpdateInfo | null;
  isFabDismissed: boolean;
  isDialogOpen: boolean;
  isChecking: boolean;
  installPhase: InstallPhase;
  downloadedBytes: number;
  totalBytes: number;
  lastCheckAt: number;

  setPendingUpdate: (update: UpdateInfo | null) => void;
  setIsFabDismissed: (isDismissed: boolean) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  setIsChecking: (isChecking: boolean) => void;
  setInstallPhase: (phase: InstallPhase) => void;
  setDownloadProgress: (downloadedBytes: number, totalBytes: number) => void;
  setLastCheckAt: (lastCheckAt: number) => void;
  resetInstallState: () => void;
}

type AboutPersistedState = Pick<AboutState, 'lastCheckAt'>;

const STORAGE_KEY = 'alent-red:about';

export const useAboutStore = create<AboutState>()(
  persist(
    (set): AboutState => ({
      pendingUpdate: null,
      isFabDismissed: false,
      isDialogOpen: false,
      isChecking: false,
      installPhase: InstallPhase.Idle,
      downloadedBytes: 0,
      totalBytes: 0,
      lastCheckAt: 0,

      setPendingUpdate: (update): void => {
        set({ pendingUpdate: update, isFabDismissed: false });
      },
      setIsFabDismissed: (isDismissed): void => {
        set({ isFabDismissed: isDismissed });
      },
      setIsDialogOpen: (isOpen): void => {
        set({ isDialogOpen: isOpen });
      },
      setIsChecking: (isChecking): void => {
        set({ isChecking });
      },
      setInstallPhase: (phase): void => {
        set({ installPhase: phase });
      },
      setDownloadProgress: (downloadedBytes, totalBytes): void => {
        set({ downloadedBytes, totalBytes });
      },
      setLastCheckAt: (lastCheckAt): void => {
        set({ lastCheckAt });
      },
      resetInstallState: (): void => {
        set({
          installPhase: InstallPhase.Idle,
          downloadedBytes: 0,
          totalBytes: 0,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage((): Storage => localStorage),
      partialize: (state): AboutPersistedState => ({
        lastCheckAt: state.lastCheckAt,
      }),
    },
  ),
);
