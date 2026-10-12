import * as React from 'react';

import { openPath } from '@tauri-apps/plugin-opener';
import { FolderOpen, X } from 'lucide-react';

import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogDescription } from '@/shared/views/dialog-description';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';

interface OpenAttachedFileDialogProps {
  path: string;
  onClose: () => void;
}

export const OpenAttachedFileDialog = ({
  path,
  onClose,
}: OpenAttachedFileDialogProps): React.ReactElement => {
  const runConfirm = async (): Promise<void> => {
    try {
      await openPath(path);
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
          <DialogTitle>{translate('messages.openFileTitle')}</DialogTitle>
          <DialogDescription className="font-mono text-[12px] break-all">{path}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            <X size={13} />
            {translate('messages.cancel')}
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            <FolderOpen size={13} />
            {translate('messages.openFileCta')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
