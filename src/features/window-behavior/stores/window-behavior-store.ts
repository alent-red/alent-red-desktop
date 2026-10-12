import { emit } from '@tauri-apps/api/event';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { WINDOW_BEHAVIOR_CHANGED_EVENT } from '@/features/window-behavior/events/window-behavior-changed-event';
import type { WindowBehavior } from '@/features/window-behavior/types/window-behavior';

interface SetOptions {
  broadcast?: boolean;
}

export interface WindowBehaviorState extends WindowBehavior {
  setIsAlwaysOnTop: (value: boolean, options?: SetOptions) => void;
  setIsContentProtected: (value: boolean, options?: SetOptions) => void;
}

const STORAGE_KEY = 'alent-red:window-behavior';

function broadcast(state: WindowBehaviorState): void {
  const payload: WindowBehavior = {
    isAlwaysOnTop: state.isAlwaysOnTop,
    isContentProtected: state.isContentProtected,
  };
  void emit(WINDOW_BEHAVIOR_CHANGED_EVENT, payload);
}

export const useWindowBehaviorStore = create<WindowBehaviorState>()(
  persist(
    (set, get): WindowBehaviorState => ({
      isAlwaysOnTop: false,
      isContentProtected: false,

      setIsAlwaysOnTop: (value, options): void => {
        if (get().isAlwaysOnTop === value) {
          return;
        }
        set({ isAlwaysOnTop: value });
        if (options?.broadcast !== false) {
          broadcast(get());
        }
      },

      setIsContentProtected: (value, options): void => {
        if (get().isContentProtected === value) {
          return;
        }
        set({ isContentProtected: value });
        if (options?.broadcast !== false) {
          broadcast(get());
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage((): Storage => localStorage),
      partialize: (state): WindowBehavior => ({
        isAlwaysOnTop: state.isAlwaysOnTop,
        isContentProtected: state.isContentProtected,
      }),
    },
  ),
);
