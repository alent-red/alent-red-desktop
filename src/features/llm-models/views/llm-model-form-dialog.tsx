import * as React from 'react';

import { useLlmModel } from '@/features/llm-models/queries/use-llm-model';
import { LlmModelForm } from '@/features/llm-models/views/llm-model-form';
import { useProviders } from '@/features/providers/queries/use-providers';
import { translate } from '@/shared/i18n/translate';
import { FormMode } from '@/shared/types/form-mode';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

interface LlmModelFormDialogProps {
  mode: FormMode;
  modelId: string | null;
  onClose: () => void;
}

export const LlmModelFormDialog = ({
  mode,
  modelId,
  onClose,
}: LlmModelFormDialogProps): React.ReactElement => {
  const providersQuery = useProviders();
  const modelQuery = useLlmModel(mode === FormMode.Edit ? modelId : undefined);
  const bootstrapQueries = mode === FormMode.Edit ? [providersQuery, modelQuery] : [providersQuery];
  return (
    <Dialog
      open
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>
            {mode === FormMode.Create
              ? translate('llmModels.addModelTitle')
              : translate('llmModels.editModelTitle')}
          </DialogTitle>
        </DialogHeader>
        <FormBootstrap queries={bootstrapQueries} loadingClassName="min-h-[260px]">
          <LlmModelForm
            mode={mode}
            model={modelQuery.data ?? null}
            providers={providersQuery.data ?? []}
            onClose={onClose}
          />
        </FormBootstrap>
      </DialogContent>
    </Dialog>
  );
};
