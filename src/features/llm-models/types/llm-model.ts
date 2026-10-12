import type { LlmModelCache } from '@/features/llm-models/types/llm-model-cache';
import type { LlmModelImageDetail } from '@/features/llm-models/types/llm-model-image-detail';

export interface LlmModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  modelId: string;
  contextWindowTokensCount: number;
  maxOutputTokensCount: number;
  topP: number;
  imageDetail: LlmModelImageDetail;
  cache: LlmModelCache;
  providerId: string;
}
