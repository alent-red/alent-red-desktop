import * as React from 'react';

import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { LlmModelsManagementView } from '@/features/llm-models/views/llm-models-management-view';
import { openCreateLlmModelDialog } from '@/windows/settings-window/actions/open-create-llm-model-dialog';
import { openDeleteLlmModelDialog } from '@/windows/settings-window/actions/open-delete-llm-model-dialog';
import { openEditLlmModelDialog } from '@/windows/settings-window/actions/open-edit-llm-model-dialog';

export const LlmModelsView = (): React.ReactElement => {
  return (
    <LlmModelsManagementView
      onAddLlmModel={openCreateLlmModelDialog}
      onEditLlmModel={openEditLlmModelDialog}
      onDeleteLlmModel={(model: LlmModel): void => {
        openDeleteLlmModelDialog(model.id);
      }}
    />
  );
};
