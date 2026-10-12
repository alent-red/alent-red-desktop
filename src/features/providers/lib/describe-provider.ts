import { PROVIDER_KIND_LABEL_KEY } from '@/features/providers/constants/provider-kind-label-key';
import type { Provider } from '@/features/providers/types/provider';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import { translate } from '@/shared/i18n/translate';
import { assertNever } from '@/shared/lib/assert-never';

export function describeProvider(provider: Provider): string {
  const config = provider.config;
  switch (config.type) {
    case ProviderConfigType.Anthropic:
      return translate(PROVIDER_KIND_LABEL_KEY[ProviderConfigType.Anthropic]);
    case ProviderConfigType.Openai:
      return translate(PROVIDER_KIND_LABEL_KEY[ProviderConfigType.Openai]);
    case ProviderConfigType.LmStudio:
      return `${translate(PROVIDER_KIND_LABEL_KEY[ProviderConfigType.LmStudio])} · ${config.baseUrl}`;
    case ProviderConfigType.Custom:
      return `${translate(PROVIDER_KIND_LABEL_KEY[ProviderConfigType.Custom])} · ${config.baseUrl}`;
    default:
      return assertNever(config);
  }
}
