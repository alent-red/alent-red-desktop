import { LlmModelCache } from '@/features/llm-models/types/llm-model-cache';
import type { TranslationKey } from '@/shared/i18n/translate';

interface LlmModelCacheOption {
  value: LlmModelCache;
  labelKey: TranslationKey;
}

export const LLM_MODEL_CACHE_OPTIONS: LlmModelCacheOption[] = [
  { value: LlmModelCache.Default, labelKey: 'llmModels.cacheDefault' },
  { value: LlmModelCache.Medium, labelKey: 'llmModels.cacheMedium' },
  { value: LlmModelCache.High, labelKey: 'llmModels.cacheHigh' },
];
