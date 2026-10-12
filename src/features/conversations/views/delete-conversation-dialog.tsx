import * as React from 'react';

import { useConversation } from '@/features/conversations/queries/use-conversation';
import { useDeleteConversation } from '@/features/conversations/queries/use-delete-conversation';
import { toastError } from '@/features/toasts/actions/toast-error';
import { toastWarning } from '@/features/toasts/actions/toast-warning';
import { translate } from '@/shared/i18n/translate';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';

interface DeleteConversationDialogProps {
  conversationId: string;
  onClose: () => void;
  onDeleted: (conversationId: string) => void;
}

export const DeleteConversationDialog = ({
  conversationId,
  onClose,
  onDeleted,
}: DeleteConversationDialogProps): React.ReactElement => {
  const { data: conversation } = useConversation(conversationId);
  const deleteConversation = useDeleteConversation();

  const handleConfirm = async (): Promise<void> => {
    if (conversation?.processing === true) {
      toastWarning(translate('conversations.cantDeleteProcessing'));
      return;
    }
    try {
      await deleteConversation.mutateAsync(conversationId);
      onDeleted(conversationId);
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
      title={translate('conversations.deleteTitle')}
      body={translate('conversations.deleteBody')}
      confirmCta={translate('conversations.deleteCta')}
      cancelLabel={translate('agents.cancel')}
      requirePhrase={false}
      isWorking={deleteConversation.isPending}
      onConfirm={handleConfirm}
    />
  );
};
