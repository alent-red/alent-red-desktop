import * as React from 'react';

import { useAgent } from '@/features/agents/queries/use-agent';
import { useDeleteAgent } from '@/features/agents/queries/use-delete-agent';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';

interface DeleteAgentDialogProps {
  agentId: string;
  onClose: () => void;
}

export const DeleteAgentDialog = ({
  agentId,
  onClose,
}: DeleteAgentDialogProps): React.ReactElement => {
  const { data: agent } = useAgent(agentId);
  const deleteAgent = useDeleteAgent();

  const handleConfirm = async (): Promise<void> => {
    try {
      await deleteAgent.mutateAsync(agentId);
      onClose();
    } catch (caught) {
      toastError(caught);
    }
  };

  return (
    <ConfirmDeleteDialog
      isOpen
      onOpenChange={(isOpen: boolean): void => {
        if (!isOpen) {
          onClose();
        }
      }}
      title={translate('agents.deleteTitle', { name: agent?.name ?? '' })}
      body={translate('agents.deleteBody')}
      confirmCta={translate('agents.deleteCta')}
      cancelLabel={translate('agents.cancel')}
      requirePhrase
      isWorking={deleteAgent.isPending}
      onConfirm={handleConfirm}
    />
  );
};
