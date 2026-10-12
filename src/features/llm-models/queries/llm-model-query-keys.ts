export const llmModelQueryKeys = {
  all: ['llm-models'] as const,
  list: (providerId: string | null): readonly ['llm-models', string | null] =>
    ['llm-models', providerId] as const,
  single: (id: string): readonly ['llm-model', string] => ['llm-model', id] as const,
};
