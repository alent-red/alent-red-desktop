import * as React from 'react';

import { Copy, Pencil, Scissors } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Tooltip } from '@/shared/views/tooltip';

interface MessageHoverActionsProps {
  messageId: string;
  onSplitConversation: (messageId: string) => void;
  onCopy?: () => void;
  onEdit?: () => void;
  className?: string;
}

const ACTION_BUTTON_CLASSES =
  'h-6 w-6 inline-flex items-center justify-center rounded-[6px] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]';

export const MessageHoverActions = ({
  messageId,
  onSplitConversation,
  onCopy,
  onEdit,
  className,
}: MessageHoverActionsProps): React.ReactElement => {
  const handleSplitClick = (): void => {
    onSplitConversation(messageId);
  };
  return (
    <div
      className={mergeClasses(
        'absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity',
        'inline-flex items-center gap-0.5 rounded-[8px] bg-[var(--bg-surface-raised)] border border-[var(--border-default)] shadow-[var(--shadow-sm)] px-0.5 py-0.5',
        className,
      )}
    >
      {onEdit !== undefined ? (
        <Tooltip content={translate('messages.edit')}>
          <button
            type="button"
            aria-label={translate('messages.edit')}
            onClick={onEdit}
            className={ACTION_BUTTON_CLASSES}
          >
            <Pencil size={12} strokeWidth={2.1} />
          </button>
        </Tooltip>
      ) : null}
      {onCopy !== undefined ? (
        <Tooltip content={translate('messages.copy')}>
          <button
            type="button"
            aria-label={translate('messages.copy')}
            onClick={onCopy}
            className={ACTION_BUTTON_CLASSES}
          >
            <Copy size={12} strokeWidth={2.1} />
          </button>
        </Tooltip>
      ) : null}
      <Tooltip content={translate('conversations.split')}>
        <button
          type="button"
          aria-label={translate('conversations.split')}
          onClick={handleSplitClick}
          className={ACTION_BUTTON_CLASSES}
        >
          <Scissors size={12} strokeWidth={2.1} />
        </button>
      </Tooltip>
    </div>
  );
};
