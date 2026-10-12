import type { Provider } from '@/features/providers/types/provider';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';

export function initialApiKeyFromProvider(provider: Provider | null): string {
  if (provider === null) {
    return '';
  }
  const config = provider.config;
  if (config.type === ProviderConfigType.Anthropic || config.type === ProviderConfigType.Openai) {
    return config.apiKey;
  }
  if (config.type === ProviderConfigType.Custom && config.apiKey !== null) {
    return config.apiKey;
  }
  return '';
}
