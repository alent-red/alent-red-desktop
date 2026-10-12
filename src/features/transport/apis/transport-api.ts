import type { TransportStatus } from '@/features/transport/types/transport-status';
import { invoke } from '@/shared/invoke/invoke';

export const transportApi = {
  async connect(): Promise<TransportStatus> {
    return invoke<TransportStatus>('transport_connect');
  },
  async status(): Promise<TransportStatus> {
    return invoke<TransportStatus>('transport_status');
  },
};
