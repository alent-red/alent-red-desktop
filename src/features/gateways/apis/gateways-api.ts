import type { Gateway } from '@/features/gateways/types/gateway';
import type { GatewayInput } from '@/features/gateways/types/gateway-input';
import { invoke } from '@/shared/invoke/invoke';

export const gatewaysApi = {
  getAll: (agentId: string | null): Promise<Gateway[]> =>
    invoke<Gateway[]>('gateways_get_all', { agentId: agentId ?? undefined }),
  get: (id: string): Promise<Gateway> => invoke<Gateway>('gateways_get', { id }),
  save: (gateway: GatewayInput, id: string | null): Promise<Gateway> =>
    invoke<Gateway>('gateways_save', { id: id ?? undefined, gateway }),
  delete: (id: string): Promise<void> => invoke('gateways_delete', { id }),
};
