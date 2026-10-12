import * as React from 'react';

import { useDeleteLlmModel } from '@/features/llm-models/queries/use-delete-llm-model';
import { useLlmModel } from '@/features/llm-models/queries/use-llm-model';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';

interface DeleteLlmModelDialogProps {
  llmModelId: string;
  onClose: () => void;
}

export const DeleteLlmModelDialog = ({
  llmModelId,
  onClose,
}: DeleteLlmModelDialogProps): React.ReactElement => {
  const { data: model } = useLlmModel(llmModelId);
  const deleteModel = useDeleteLlmModel();
  return (
    <ConfirmDeleteDialog
      isOpen
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
      title={translate('llmModels.deleteTitle', { name: model?.name ?? '' })}
      body={translate('llmModels.deleteBody')}
      confirmCta={translate('llmModels.deleteCta')}
      requirePhrase
      isWorking={deleteModel.isPending}
      onConfirm={async (): Promise<void> => {
        try {
          await deleteModel.mutateAsync(llmModelId);
          onClose();
        } catch (caught) {
          toastError(caught);
        }
      }}
    />
  );
};
