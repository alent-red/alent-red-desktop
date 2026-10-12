import { useTransportStore } from '@/features/transport/stores/transport-store';

export async function connectTransport(): Promise<void> {
  await useTransportStore.getState().connect();
}
