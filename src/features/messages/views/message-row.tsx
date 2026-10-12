import * as React from 'react';

import type { Message } from '@/features/messages/types/message';
import { MessageContentType } from '@/features/messages/types/message-content-type';
import { MessageAiBubble } from '@/features/messages/views/message-ai-bubble';
import { MessageInternalBubble } from '@/features/messages/views/message-internal-bubble';
import { MessageToolBubble } from '@/features/messages/views/message-tool-bubble';
import { MessageUserBubble } from '@/features/messages/views/message-user-bubble';
import { assertNever } from '@/shared/lib/assert-never';

interface MessageRowProps {
  message: Message;
  onSplitConversation: (messageId: string) => void;
  onOpenAttachedFile: (path: string) => void;
}

export const MessageRow = ({
  message,
  onSplitConversation,
  onOpenAttachedFile,
}: MessageRowProps): React.ReactElement => {
  const { content } = message;
  switch (content.type) {
    case MessageContentType.Internal:
      return <MessageInternalBubble text={content.text} />;
    case MessageContentType.User:
      return (
        <MessageUserBubble
          messageId={message.id}
          conversationId={message.conversationId}
          text={content.text}
          attachedFilePaths={content.attachedFilePaths}
          onSplitConversation={onSplitConversation}
          onOpenAttachedFile={onOpenAttachedFile}
        />
      );
    case MessageContentType.Ai:
      return (
        <MessageAiBubble
          messageId={message.id}
          text={content.text}
          onSplitConversation={onSplitConversation}
          onOpenAttachedFile={onOpenAttachedFile}
        />
      );
    case MessageContentType.Tool:
      return (
        <MessageToolBubble
          messageId={message.id}
          content={content}
          onSplitConversation={onSplitConversation}
        />
      );
    default:
      return assertNever(content);
  }
};
