import * as React from 'react';

import { Trash, X, type LucideIcon } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Dialog } from '@/shared/views/dialog';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogDescription } from '@/shared/views/dialog-description';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { Input } from '@/shared/views/input';
import { Spinner } from '@/shared/views/spinner';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  body: string;
  confirmCta: string;
  cancelLabel?: string;
  confirmIcon?: LucideIcon;
  requirePhrase?: boolean;
  isWorking?: boolean;
  isNested?: boolean;
  onConfirm: () => void | Promise<void>;
}

const CONFIRM_PHRASE = 'DELETE';

export const ConfirmDeleteDialog = ({
  isOpen,
  onOpenChange,
  title,
  body,
  confirmCta,
  cancelLabel,
  confirmIcon = Trash,
  requirePhrase = true,
  isWorking = false,
  isNested = false,
  onConfirm,
}: ConfirmDeleteDialogProps): React.ReactElement => {
  const [phrase, setPhrase] = React.useState('');
  const [wasOpen, setWasOpen] = React.useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (!isOpen) {
      setPhrase('');
    }
  }

  const ConfirmIcon = confirmIcon;
  const canConfirm = !requirePhrase || phrase === CONFIRM_PHRASE;

  const handleConfirm = (): void => {
    if (!canConfirm || isWorking) {
      return;
    }
    void onConfirm();
  };

  const handleCancelClick = (): void => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="sm" isNested={isNested}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
        {requirePhrase ? (
          <DialogBody>
            <Input
              value={phrase}
              onChange={(event): void => {
                setPhrase(event.target.value);
              }}
              placeholder={translate('common.typePhrase', { phrase: CONFIRM_PHRASE })}
              aria-label={translate('common.typePhraseToConfirm', { phrase: CONFIRM_PHRASE })}
              disabled={isWorking}
            />
          </DialogBody>
        ) : null}
        <DialogFooter>
          <Button variant="ghost" onClick={handleCancelClick}>
            <X size={13} />
            {cancelLabel ?? translate('common.cancel')}
          </Button>
          <Button variant="danger" disabled={!canConfirm || isWorking} onClick={handleConfirm}>
            {isWorking ? <Spinner size={13} className="text-current" /> : <ConfirmIcon size={13} />}
            {confirmCta}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
