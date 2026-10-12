import { PROVIDER_KIND_ICON } from '@/features/providers/constants/provider-kind-icon';
import { PROVIDER_KIND_LABEL_KEY } from '@/features/providers/constants/provider-kind-label-key';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import type { KindOption } from '@/shared/views/kind-picker';

export const PROVIDER_KIND_OPTIONS: KindOption<ProviderConfigType>[] = [
  {
    value: ProviderConfigType.Anthropic,
    labelKey: PROVIDER_KIND_LABEL_KEY[ProviderConfigType.Anthropic],
    icon: PROVIDER_KIND_ICON[ProviderConfigType.Anthropic],
  },
  {
    value: ProviderConfigType.Openai,
    labelKey: PROVIDER_KIND_LABEL_KEY[ProviderConfigType.Openai],
    icon: PROVIDER_KIND_ICON[ProviderConfigType.Openai],
  },
  {
    value: ProviderConfigType.LmStudio,
    labelKey: PROVIDER_KIND_LABEL_KEY[ProviderConfigType.LmStudio],
    icon: PROVIDER_KIND_ICON[ProviderConfigType.LmStudio],
  },
  {
    value: ProviderConfigType.Custom,
    labelKey: PROVIDER_KIND_LABEL_KEY[ProviderConfigType.Custom],
    icon: PROVIDER_KIND_ICON[ProviderConfigType.Custom],
  },
];
