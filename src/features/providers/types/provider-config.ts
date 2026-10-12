import type { ProviderApiFormat } from '@/features/providers/types/provider-api-format';
import { type ProviderConfigType } from '@/features/providers/types/provider-config-type';

export type ProviderConfig =
  | { type: typeof ProviderConfigType.Anthropic; apiKey: string }
  | { type: typeof ProviderConfigType.Openai; apiKey: string }
  | { type: typeof ProviderConfigType.LmStudio; baseUrl: string }
  | {
      type: typeof ProviderConfigType.Custom;
      baseUrl: string;
      apiKey: string | null;
      apiFormat: ProviderApiFormat;
    };
