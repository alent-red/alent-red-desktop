import { LlmModelImageDetail } from '@/features/llm-models/types/llm-model-image-detail';
import type { TranslationKey } from '@/shared/i18n/translate';

interface LlmModelImageDetailOption {
  value: LlmModelImageDetail;
  labelKey: TranslationKey;
}

export const LLM_MODEL_IMAGE_DETAIL_OPTIONS: LlmModelImageDetailOption[] = [
  { value: LlmModelImageDetail.Default, labelKey: 'llmModels.imageDetailDefault' },
  { value: LlmModelImageDetail.Low, labelKey: 'llmModels.imageDetailLow' },
  { value: LlmModelImageDetail.High, labelKey: 'llmModels.imageDetailHigh' },
];
