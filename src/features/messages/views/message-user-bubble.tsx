import * as React from 'react';

import { Check, Paperclip, Pencil, X } from 'lucide-react';

import { useSaveMessage } from '@/features/messages/queries/use-save-message';
import { MessageHoverActions } from '@/features/messages/views/message-hover-actions';
import { toastError } from '@/features/toasts/actions/toast-error';
import { toastSuccess } from '@/features/toasts/actions/toast-success';
import { translate } from '@/shared/i18n/translate';
import { copyTextToClipboard } from '@/shared/lib/copy-text-to-clipboard';
import { extractPathBasename } from '@/shared/lib/extract-path-basename';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { AutoTextarea } from '@/shared/views/auto-textarea';
import { Button } from '@/shared/views/button';
import { ConfirmDeleteDialog } from '@/shared/views/confirm-delete-dialog';
import { Spinner } from '@/shared/views/spinner';

interface MessageUserBubbleProps {
  messageId: string;
  conversationId: string;
  text: string;
  attachedFilePaths: string[];
  onSplitConversation: (messageId: string) => void;
  onOpenAttachedFile: (path: string) => void;
}

export const MessageUserBubble = ({
  messageId,
  conversationId,
  text,
  attachedFilePaths,
  onSplitConversation,
  onOpenAttachedFile,
}: MessageUserBubbleProps): React.ReactElement => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(text);
  const saveMessage = useSaveMessage();

  const handleCopy = (): void => {
    copyTextToClipboard(text)
      .then((): void => {
        toastSuccess(translate('messages.copied'));
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });
  };

  const handleEditClick = (): void => {
    setDraft(text);
    setIsEditing(true);
  };

  const handleCancelEdit = (): void => {
    setIsEditing(false);
    setDraft(text);
  };

  const handleSaveClick = (): void => {
    if (draft.trim().length === 0 || saveMessage.isPending) {
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async (): Promise<void> => {
    const trimmed = draft.trim();
    if (trimmed.length === 0 || saveMessage.isPending) {
      return;
    }
    try {
      await saveMessage.mutateAsync({
        input: { text: trimmed, attachedFilePaths, conversationId },
        id: messageId,
      });
      setIsConfirmOpen(false);
      setIsEditing(false);
    } catch (caught) {
      toastError(caught);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleCancelEdit();
      return;
    }
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      handleSaveClick();
    }
  };

  const confirmDialog = (
    <ConfirmDeleteDialog
      isOpen={isConfirmOpen}
      onOpenChange={setIsConfirmOpen}
      title={translate('messages.editTitle')}
      body={translate('messages.editBody')}
      confirmCta={translate('messages.editCta')}
      confirmIcon={Pencil}
      requirePhrase={false}
      isWorking={saveMessage.isPending}
      onConfirm={handleConfirmSave}
    />
  );

  if (isEditing) {
    return (
      <>
        <div className="group relative self-end w-full max-w-[78%] flex flex-col items-end gap-1.5">
          <AutoTextarea
            value={draft}
            onChange={(event): void => {
              setDraft(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            minRows={1}
            maxRows={12}
            autoFocus
            disabled={saveMessage.isPending}
          />
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleCancelEdit} disabled={saveMessage.isPending}>
              <X size={13} />
              {translate('messages.editCancel')}
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveClick}
              disabled={saveMessage.isPending || draft.trim().length === 0}
            >
              {saveMessage.isPending ? (
                <Spinner size={13} className="text-current" />
              ) : (
                <Check size={13} />
              )}
              {translate('messages.editSave')}
            </Button>
          </div>
        </div>
        {confirmDialog}
      </>
    );
  }

  return (
    <div className="group relative self-end max-w-[78%] flex flex-col items-end gap-1.5">
      <MessageHoverActions
        messageId={messageId}
        onSplitConversation={onSplitConversation}
        onCopy={handleCopy}
        onEdit={handleEditClick}
      />
      <div
        className={mergeClasses(
          'rounded-[14px] rounded-br-[6px] px-3.5 py-2',
          'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] text-[13.5px] leading-[1.5]',
          'whitespace-pre-wrap break-words shadow-[var(--shadow-xs)] select-text',
        )}
      >
        {text}
      </div>
      {attachedFilePaths.length > 0 ? (
        <div className="flex flex-wrap gap-1 justify-end max-w-full">
          {attachedFilePaths.map(
            (path): React.ReactElement => (
              <button
                key={path}
                type="button"
                onClick={(): void => {
                  onOpenAttachedFile(path);
                }}
                className={mergeClasses(
                  'inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border-default)]',
                  'bg-[var(--bg-surface)] px-2 py-1 text-[11.5px] text-[var(--text-secondary)]',
                  'hover:bg-[var(--bg-hover)] transition-colors max-w-[260px]',
                )}
                title={path}
              >
                <Paperclip size={11} className="shrink-0 text-[var(--text-muted)]" />
                <span className="truncate">{extractPathBasename(path)}</span>
              </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
};
