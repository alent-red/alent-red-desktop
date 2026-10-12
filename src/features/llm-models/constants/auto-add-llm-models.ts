import { LlmModelCache } from '@/features/llm-models/types/llm-model-cache';
import { LlmModelImageDetail } from '@/features/llm-models/types/llm-model-image-detail';
import type { LlmModelInput } from '@/features/llm-models/types/llm-model-input';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';

export type AutoAddLlmModelTemplate = Omit<LlmModelInput, 'providerId'>;

export type AutoAddSupportedProviderType = Extract<
  ProviderConfigType,
  typeof ProviderConfigType.Anthropic | typeof ProviderConfigType.Openai
>;

// Max output is 5% of the context window, the project-wide default.
const CLAUDE_CONTEXT_WINDOW_TOKENS_COUNT = 1000000;
const CLAUDE_MAX_OUTPUT_TOKENS_COUNT = 50000;
const GPT_CONTEXT_WINDOW_TOKENS_COUNT = 1050000;
const GPT_MAX_OUTPUT_TOKENS_COUNT = 52500;
const DEFAULT_TOP_P = 0.7;

const ANTHROPIC_LLM_MODELS: AutoAddLlmModelTemplate[] = [
  {
    name: 'Claude Opus 5.5',
    modelId: 'claude-opus-5-5',
    contextWindowTokensCount: CLAUDE_CONTEXT_WINDOW_TOKENS_COUNT,
    maxOutputTokensCount: CLAUDE_MAX_OUTPUT_TOKENS_COUNT,
    topP: DEFAULT_TOP_P,
    imageDetail: LlmModelImageDetail.High,
    cache: LlmModelCache.Medium,
  },
  {
    name: 'Claude Sonnet 5.5',
    modelId: 'claude-sonnet-5-5',
    contextWindowTokensCount: CLAUDE_CONTEXT_WINDOW_TOKENS_COUNT,
    maxOutputTokensCount: CLAUDE_MAX_OUTPUT_TOKENS_COUNT,
    topP: DEFAULT_TOP_P,
    imageDetail: LlmModelImageDetail.High,
    cache: LlmModelCache.Medium,
  },
  {
    name: 'Claude Haiku 5.5',
    modelId: 'claude-haiku-5-5',
    contextWindowTokensCount: CLAUDE_CONTEXT_WINDOW_TOKENS_COUNT,
    maxOutputTokensCount: CLAUDE_MAX_OUTPUT_TOKENS_COUNT,
    topP: DEFAULT_TOP_P,
    imageDetail: LlmModelImageDetail.High,
    cache: LlmModelCache.Medium,
  },
];

const OPENAI_LLM_MODELS: AutoAddLlmModelTemplate[] = [
  {
    name: 'GPT-5.6 Sol',
    modelId: 'gpt-5.6-sol',
    contextWindowTokensCount: GPT_CONTEXT_WINDOW_TOKENS_COUNT,
    maxOutputTokensCount: GPT_MAX_OUTPUT_TOKENS_COUNT,
    topP: DEFAULT_TOP_P,
    imageDetail: LlmModelImageDetail.High,
    cache: LlmModelCache.Medium,
  },
  {
    name: 'GPT-5.6 Terra',
    modelId: 'gpt-5.6-terra',
    contextWindowTokensCount: GPT_CONTEXT_WINDOW_TOKENS_COUNT,
    maxOutputTokensCount: GPT_MAX_OUTPUT_TOKENS_COUNT,
    topP: DEFAULT_TOP_P,
    imageDetail: LlmModelImageDetail.High,
    cache: LlmModelCache.Medium,
  },
  {
    name: 'GPT-5.6 Luna',
    modelId: 'gpt-5.6-luna',
    contextWindowTokensCount: GPT_CONTEXT_WINDOW_TOKENS_COUNT,
    maxOutputTokensCount: GPT_MAX_OUTPUT_TOKENS_COUNT,
    topP: DEFAULT_TOP_P,
    imageDetail: LlmModelImageDetail.High,
    cache: LlmModelCache.Medium,
  },
];

export const AUTO_ADD_LLM_MODELS: Record<AutoAddSupportedProviderType, AutoAddLlmModelTemplate[]> =
  {
    [ProviderConfigType.Anthropic]: ANTHROPIC_LLM_MODELS,
    [ProviderConfigType.Openai]: OPENAI_LLM_MODELS,
  };
