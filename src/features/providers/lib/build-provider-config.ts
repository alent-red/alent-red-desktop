import type { ProviderApiFormat } from '@/features/providers/types/provider-api-format';
import type { ProviderConfig } from '@/features/providers/types/provider-config';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import { assertNever } from '@/shared/lib/assert-never';

export interface BuildProviderConfigInputs {
  kind: ProviderConfigType;
  trimmedApiKey: string;
  trimmedBaseUrl: string;
  customApiFormat: ProviderApiFormat;
}

export function buildProviderConfig(inputs: BuildProviderConfigInputs): ProviderConfig {
  const { kind, trimmedApiKey, trimmedBaseUrl, customApiFormat } = inputs;
  switch (kind) {
    case ProviderConfigType.Anthropic:
      return { type: ProviderConfigType.Anthropic, apiKey: trimmedApiKey };
    case ProviderConfigType.Openai:
      return { type: ProviderConfigType.Openai, apiKey: trimmedApiKey };
    case ProviderConfigType.LmStudio:
      return { type: ProviderConfigType.LmStudio, baseUrl: trimmedBaseUrl };
    case ProviderConfigType.Custom:
      return {
        type: ProviderConfigType.Custom,
        baseUrl: trimmedBaseUrl,
        apiKey: trimmedApiKey.length > 0 ? trimmedApiKey : null,
        apiFormat: customApiFormat,
      };
    default:
      return assertNever(kind);
  }
}
