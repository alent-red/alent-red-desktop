import * as React from 'react';

import { Scissors, X } from 'lucide-react';

import { useSplitConversation } from '@/features/conversations/queries/use-split-conversation';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogDescription } from '@/shared/views/dialog-description';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { Spinner } from '@/shared/views/spinner';

interface SplitConversationDialogProps {
  messageId: string;
  onClose: () => void;
}

export const SplitConversationDialog = ({
  messageId,
  onClose,
}: SplitConversationDialogProps): React.ReactElement => {
  const split = useSplitConversation();

  const runConfirm = async (): Promise<void> => {
    try {
      await split.mutateAsync(messageId);
      onClose();
    } catch (caught) {
      toastError(caught);
    }
  };

  const handleConfirm = (): void => {
    void runConfirm();
  };

  return (
    <Dialog
      open
      onOpenChange={(isOpen: boolean): void => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{translate('conversations.splitConfirmTitle')}</DialogTitle>
          <DialogDescription>{translate('conversations.splitConfirmBody')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            <X size={13} />
            {translate('agents.cancel')}
          </Button>
          <Button variant="primary" disabled={split.isPending} onClick={handleConfirm}>
            {split.isPending ? (
              <Spinner size={13} className="text-current" />
            ) : (
              <Scissors size={13} />
            )}
            {translate('conversations.split')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
