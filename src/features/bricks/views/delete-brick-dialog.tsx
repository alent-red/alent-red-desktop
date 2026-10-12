import * as React from 'react';

import { useBrick } from '@/features/bricks/queries/use-brick';
import { useDeleteBrick } from '@/features/bricks/queries/use-delete-brick';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';

interface DeleteBrickDialogProps {
  brickId: string;
  onClose: () => void;
}

export const DeleteBrickDialog = ({
  brickId,
  onClose,
}: DeleteBrickDialogProps): React.ReactElement => {
  const { data: brick } = useBrick(brickId);
  const deleteBrick = useDeleteBrick();
  return (
    <ConfirmDeleteDialog
      isOpen
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
      title={translate('bricks.deleteTitle', { name: brick?.name ?? '' })}
      body={translate('bricks.deleteBody')}
      confirmCta={translate('bricks.deleteCta')}
      requirePhrase
      isWorking={deleteBrick.isPending}
      onConfirm={async (): Promise<void> => {
        try {
          await deleteBrick.mutateAsync(brickId);
          onClose();
        } catch (caught) {
          toastError(caught);
        }
      }}
    />
  );
};
