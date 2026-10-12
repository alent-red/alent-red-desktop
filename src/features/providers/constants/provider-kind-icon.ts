import type { LucideIcon } from 'lucide-react';
import { Box, Cloud, Settings2, Sparkles } from 'lucide-react';

import { ProviderConfigType } from '@/features/providers/types/provider-config-type';

export const PROVIDER_KIND_ICON: Record<ProviderConfigType, LucideIcon> = {
  [ProviderConfigType.Anthropic]: Sparkles,
  [ProviderConfigType.Openai]: Cloud,
  [ProviderConfigType.LmStudio]: Box,
  [ProviderConfigType.Custom]: Settings2,
};
