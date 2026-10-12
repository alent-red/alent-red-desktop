import type { Provider } from '@/features/providers/types/provider';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';

export function initialBaseUrlFromProvider(provider: Provider | null): string {
  if (provider === null) {
    return '';
  }
  const config = provider.config;
  if (config.type === ProviderConfigType.LmStudio || config.type === ProviderConfigType.Custom) {
    return config.baseUrl;
  }
  return '';
}
