import * as React from 'react';

import { Trash } from 'lucide-react';

import { useDeleteProvider } from '@/features/providers/queries/use-delete-provider';
import { useProvider } from '@/features/providers/queries/use-provider';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';

interface DeleteProviderDialogProps {
  providerId: string;
  onClose: () => void;
}

export const DeleteProviderDialog = ({
  providerId,
  onClose,
}: DeleteProviderDialogProps): React.ReactElement => {
  const { data: provider } = useProvider(providerId);
  const deleteProvider = useDeleteProvider();
  return (
    <ConfirmDeleteDialog
      isOpen
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
      title={translate('providers.deleteTitle', { name: provider?.name ?? '' })}
      body={translate('providers.deleteBody')}
      confirmCta={translate('providers.deleteCta')}
      confirmIcon={Trash}
      requirePhrase
      isWorking={deleteProvider.isPending}
      onConfirm={async (): Promise<void> => {
        try {
          await deleteProvider.mutateAsync(providerId);
          onClose();
        } catch (caught) {
          toastError(caught);
        }
      }}
    />
  );
};
