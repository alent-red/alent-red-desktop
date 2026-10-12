import * as React from 'react';

import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { LlmModelRow } from '@/features/llm-models/views/llm-model-row';
import { LlmModelsEmptyState } from '@/features/llm-models/views/llm-models-empty-state';
import type { Provider } from '@/features/providers/types/provider';
import { translate } from '@/shared/i18n/translate';

interface LlmModelsListProps {
  models: LlmModel[];
  filteredByProvider: LlmModel[];
  filteredModels: LlmModel[];
  query: string;
  providersById: Map<string, Provider>;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (model: LlmModel) => void;
}

export const LlmModelsList = ({
  models,
  filteredByProvider,
  filteredModels,
  query,
  providersById,
  onAdd,
  onEdit,
  onDelete,
}: LlmModelsListProps): React.ReactElement => {
  if (models.length === 0) {
    return <LlmModelsEmptyState onAdd={onAdd} />;
  }
  if (filteredByProvider.length === 0) {
    return (
      <div className="text-muted text-[12.5px] text-center py-8">
        {translate('llmModels.noModelsForProvider')}
      </div>
    );
  }
  if (filteredModels.length === 0) {
    return (
      <div className="text-muted text-[12.5px] text-center py-8">
        {translate('llmModels.noModelsMatching', { query: query.trim() })}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {filteredModels.map(
        (model): React.ReactElement => (
          <LlmModelRow
            key={model.id}
            model={model}
            provider={providersById.get(model.providerId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      )}
    </ul>
  );
};
