import type { ProviderConfig } from '@/features/providers/types/provider-config';

export interface Provider {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  config: ProviderConfig;
}
