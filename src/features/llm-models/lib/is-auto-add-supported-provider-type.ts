import type { AutoAddSupportedProviderType } from '@/features/llm-models/constants/auto-add-llm-models';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';

export function isAutoAddSupportedProviderType(
  kind: ProviderConfigType | null,
): kind is AutoAddSupportedProviderType {
  return kind === ProviderConfigType.Anthropic || kind === ProviderConfigType.Openai;
}
