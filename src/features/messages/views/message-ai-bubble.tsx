import * as React from 'react';

import { useStreamedText } from '@/features/messages/hooks/use-streamed-text';
import { MessageHoverActions } from '@/features/messages/views/message-hover-actions';
import { toastError } from '@/features/toasts/actions/toast-error';
import { toastSuccess } from '@/features/toasts/actions/toast-success';
import { translate } from '@/shared/i18n/translate';
import { copyTextToClipboard } from '@/shared/lib/copy-text-to-clipboard';
import { MarkdownText } from '@/shared/views/markdown-text';

interface MessageAiBubbleProps {
  messageId: string;
  text: string;
  onSplitConversation: (messageId: string) => void;
  onOpenAttachedFile: (path: string) => void;
}

export const MessageAiBubble = ({
  messageId,
  text,
  onSplitConversation,
  onOpenAttachedFile,
}: MessageAiBubbleProps): React.ReactElement => {
  const displayedText = useStreamedText(text);

  const handleCopy = (): void => {
    copyTextToClipboard(text)
      .then((): void => {
        toastSuccess(translate('messages.copied'));
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });
  };

  return (
    <div className="group relative self-start w-full">
      <MessageHoverActions
        messageId={messageId}
        onSplitConversation={onSplitConversation}
        onCopy={handleCopy}
      />
      {displayedText.length > 0 ? (
        <MarkdownText
          className="text-[13.5px] leading-[1.6] text-primary break-words select-text"
          onOpenPath={onOpenAttachedFile}
        >
          {displayedText}
        </MarkdownText>
      ) : (
        <div className="text-[13.5px] leading-[1.6] text-muted">
          {translate('messages.aiTyping')}
        </div>
      )}
    </div>
  );
};
