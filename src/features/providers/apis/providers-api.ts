import type { Provider } from '@/features/providers/types/provider';
import type { ProviderInput } from '@/features/providers/types/provider-input';
import { invoke } from '@/shared/invoke/invoke';

export const providersApi = {
  getAll: (): Promise<Provider[]> => invoke<Provider[]>('providers_get_all'),
  get: (id: string): Promise<Provider> => invoke<Provider>('providers_get', { id }),
  save: (provider: ProviderInput, id?: string): Promise<Provider> =>
    invoke<Provider>('providers_save', { id, provider }),
  delete: (id: string): Promise<void> => invoke('providers_delete', { id }),
};
