import { PreferenceKey } from '@/features/preferences/types/preference-key';
import { PreferenceValueType } from '@/features/preferences/types/preference-value-type';
import { type TranslationKey } from '@/shared/i18n/translate';

export interface PreferenceEntry {
  key: PreferenceKey;
  labelKey: TranslationKey;
  groupKey: TranslationKey;
  valueType: PreferenceValueType;
}

const PROMPTS_GROUP: TranslationKey = 'preferences.groupPrompts';
const PROVIDERS_GROUP: TranslationKey = 'preferences.groupProviders';
const LLM_GROUP: TranslationKey = 'preferences.groupLlm';
const ANTHROPIC_REASONING_GROUP: TranslationKey = 'preferences.groupAnthropicReasoning';
const ANTHROPIC_CACHE_GROUP: TranslationKey = 'preferences.groupAnthropicCache';

export const PREFERENCE_ENTRIES: PreferenceEntry[] = [
  {
    key: PreferenceKey.SystemPrompt,
    labelKey: 'preferences.keySystemPrompt',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.AgentPromptPlaceholder,
    labelKey: 'preferences.keyAgentPromptPlaceholder',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.BrickPromptPlaceholder,
    labelKey: 'preferences.keyBrickPromptPlaceholder',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.BrickPromptSeparator,
    labelKey: 'preferences.keyBrickPromptSeparator',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.BrickToolNameSeparator,
    labelKey: 'preferences.keyBrickToolNameSeparator',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.AttachedFilePathPromptPrefix,
    labelKey: 'preferences.keyAttachedFilePathPromptPrefix',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.AttachedFilePathPromptSeparator,
    labelKey: 'preferences.keyAttachedFilePathPromptSeparator',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.NoToolResponsePrompt,
    labelKey: 'preferences.keyNoToolResponsePrompt',
    groupKey: PROMPTS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.OpenAiBaseUrl,
    labelKey: 'preferences.keyOpenAiBaseUrl',
    groupKey: PROVIDERS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.AnthropicBaseUrl,
    labelKey: 'preferences.keyAnthropicBaseUrl',
    groupKey: PROVIDERS_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.LlmStream,
    labelKey: 'preferences.keyLlmStream',
    groupKey: LLM_GROUP,
    valueType: PreferenceValueType.Bool,
  },
  {
    key: PreferenceKey.AnthropicReasoningMinimalBudgetTokens,
    labelKey: 'preferences.keyAnthropicReasoningMinimal',
    groupKey: ANTHROPIC_REASONING_GROUP,
    valueType: PreferenceValueType.Int,
  },
  {
    key: PreferenceKey.AnthropicReasoningLowBudgetTokens,
    labelKey: 'preferences.keyAnthropicReasoningLow',
    groupKey: ANTHROPIC_REASONING_GROUP,
    valueType: PreferenceValueType.Int,
  },
  {
    key: PreferenceKey.AnthropicReasoningMediumBudgetTokens,
    labelKey: 'preferences.keyAnthropicReasoningMedium',
    groupKey: ANTHROPIC_REASONING_GROUP,
    valueType: PreferenceValueType.Int,
  },
  {
    key: PreferenceKey.AnthropicReasoningHighBudgetTokens,
    labelKey: 'preferences.keyAnthropicReasoningHigh',
    groupKey: ANTHROPIC_REASONING_GROUP,
    valueType: PreferenceValueType.Int,
  },
  {
    key: PreferenceKey.AnthropicReasoningXhighBudgetTokens,
    labelKey: 'preferences.keyAnthropicReasoningXhigh',
    groupKey: ANTHROPIC_REASONING_GROUP,
    valueType: PreferenceValueType.Int,
  },
  {
    key: PreferenceKey.AnthropicCacheMediumTtl,
    labelKey: 'preferences.keyAnthropicCacheMedium',
    groupKey: ANTHROPIC_CACHE_GROUP,
    valueType: PreferenceValueType.String,
  },
  {
    key: PreferenceKey.AnthropicCacheHighTtl,
    labelKey: 'preferences.keyAnthropicCacheHigh',
    groupKey: ANTHROPIC_CACHE_GROUP,
    valueType: PreferenceValueType.String,
  },
];
