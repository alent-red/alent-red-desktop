import { create } from 'zustand';

import { transportApi } from '@/features/transport/apis/transport-api';
import { TransportPhase } from '@/features/transport/types/transport-phase';
import type { TransportStatus } from '@/features/transport/types/transport-status';

export type TransportMarkFailed = (reason: string) => void;

export interface TransportState {
  phase: TransportPhase;
  lastError: string | null;
  connect: () => Promise<void>;
  refresh: () => Promise<void>;
  markFailed: TransportMarkFailed;
}

export const useTransportStore = create<TransportState>(
  (set, get): TransportState => ({
    phase: TransportPhase.Idle,
    lastError: null,

    connect: async (): Promise<void> => {
      set({ phase: TransportPhase.Connecting, lastError: null });
      try {
        const status: TransportStatus = await transportApi.connect();
        if (!status.connected) {
          throw new Error('Transport reported not connected');
        }
        set({ phase: TransportPhase.Connected, lastError: null });
      } catch (caught) {
        set({
          phase: TransportPhase.Failed,
          lastError: caught instanceof Error ? caught.message : String(caught),
        });
      }
    },

    refresh: async (): Promise<void> => {
      try {
        const status = await transportApi.status();
        set({
          phase: status.connected ? TransportPhase.Connected : TransportPhase.Idle,
        });
      } catch (caught) {
        set({
          phase: TransportPhase.Failed,
          lastError: caught instanceof Error ? caught.message : String(caught),
        });
      }
    },

    markFailed: (reason): void => {
      if (get().phase === TransportPhase.Failed) {
        return;
      }
      set({ phase: TransportPhase.Failed, lastError: reason });
    },
  }),
);
