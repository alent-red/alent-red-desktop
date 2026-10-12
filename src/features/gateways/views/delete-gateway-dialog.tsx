import * as React from 'react';

import { useDeleteGateway } from '@/features/gateways/queries/use-delete-gateway';
import { useGateway } from '@/features/gateways/queries/use-gateway';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';

interface DeleteGatewayDialogProps {
  gatewayId: string;
  onClose: () => void;
}

export const DeleteGatewayDialog = ({
  gatewayId,
  onClose,
}: DeleteGatewayDialogProps): React.ReactElement => {
  const { data: gateway } = useGateway(gatewayId);
  const deleteGateway = useDeleteGateway();
  return (
    <ConfirmDeleteDialog
      isOpen
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
      title={translate('gateways.deleteTitle', { name: gateway?.name ?? '' })}
      body={translate('gateways.deleteBody')}
      confirmCta={translate('gateways.deleteCta')}
      requirePhrase
      isNested
      isWorking={deleteGateway.isPending}
      onConfirm={async (): Promise<void> => {
        try {
          await deleteGateway.mutateAsync(gatewayId);
          onClose();
        } catch (caught) {
          toastError(caught);
        }
      }}
    />
  );
};
