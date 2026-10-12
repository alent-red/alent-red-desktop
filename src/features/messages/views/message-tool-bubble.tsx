import * as React from 'react';

import { AlertCircle, CheckCircle2 } from 'lucide-react';

import { presentTool } from '@/features/messages/constants/present-tool';
import type { MessageContent } from '@/features/messages/types/message-content';
import { type MessageContentType } from '@/features/messages/types/message-content-type';
import { MessageHoverActions } from '@/features/messages/views/message-hover-actions';
import { MessageToolImage } from '@/features/messages/views/message-tool-image';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { presentError } from '@/shared/lib/present-error';
import { Spinner } from '@/shared/views/spinner';

interface MessageToolBubbleProps {
  messageId: string;
  content: Extract<MessageContent, { type: typeof MessageContentType.Tool }>;
  onSplitConversation: (messageId: string) => void;
}

export const MessageToolBubble = ({
  messageId,
  content,
  onSplitConversation,
}: MessageToolBubbleProps): React.ReactElement => {
  const preset = presentTool(content.name);
  const Icon = preset.icon;
  const errorCode = content.error;
  const isProcessing = content.processing;
  const imageFileKeys = content.response?.imageFileKeys ?? [];
  const hasError = errorCode !== null;
  const [isErrorShown, setIsErrorShown] = React.useState(false);

  const renderStatusIcon = (): React.ReactElement => {
    if (hasError) {
      return <AlertCircle size={12} className="text-[var(--color-danger)]" />;
    }
    if (isProcessing) {
      return <Spinner size={11} className="text-[var(--text-secondary)]" />;
    }
    return <CheckCircle2 size={12} className="text-[var(--color-success)]" />;
  };

  const computeStatusBackground = (): string => {
    if (hasError) {
      return 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]';
    }
    if (isProcessing) {
      return 'bg-[var(--bg-active)] text-[var(--text-secondary)]';
    }
    return 'bg-[var(--color-success-bg)] text-[var(--color-success)]';
  };

  return (
    <div className="group relative self-start max-w-[88%]">
      <MessageHoverActions messageId={messageId} onSplitConversation={onSplitConversation} />
      <div
        className={mergeClasses(
          'inline-flex flex-col rounded-[10px] border border-[var(--border-default)] bg-[var(--bg-surface)]',
          'px-2.5 py-1.5 text-[12.5px] shadow-[var(--shadow-xs)]',
        )}
      >
        <button
          type="button"
          disabled={!hasError}
          aria-expanded={hasError ? isErrorShown : undefined}
          aria-label={hasError ? translate('messages.toolFailed') : undefined}
          onClick={(): void => {
            setIsErrorShown((previous): boolean => !previous);
          }}
          className={mergeClasses(
            'flex items-center gap-2 text-left focus-visible:outline-none',
            hasError ? 'cursor-pointer' : 'cursor-default',
          )}
        >
          <span
            className={mergeClasses(
              'inline-flex h-5 w-5 items-center justify-center rounded-[5px]',
              computeStatusBackground(),
            )}
          >
            <Icon size={11} strokeWidth={2.2} />
          </span>
          <span className="font-medium text-primary">{preset.display}</span>
          <span className="ml-1 shrink-0">{renderStatusIcon()}</span>
        </button>

        {hasError && isErrorShown ? (
          <div className="mt-1.5 text-[11.5px] text-[var(--color-danger)]">
            {presentError({ code: errorCode, message: null }).title}
          </div>
        ) : null}
      </div>

      {imageFileKeys.length > 0 ? (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {imageFileKeys.map(
            (fileKey): React.ReactElement => (
              <MessageToolImage key={fileKey} fileKey={fileKey} />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
};
