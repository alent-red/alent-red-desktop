import * as React from 'react';

import { ArrowDown } from 'lucide-react';

import { MessagesPanelPhase } from '@/features/messages/data/messages-panel-phase';
import { useMessagesPanelData } from '@/features/messages/data/use-messages-panel-data';
import { useMessagesAutoScroll } from '@/features/messages/hooks/use-messages-auto-scroll';
import { MessageRow } from '@/features/messages/views/message-row';
import { translate } from '@/shared/i18n/translate';
import { IconButton } from '@/shared/views/icon-button';
import { LoadingState } from '@/shared/views/loading-state';
import { QueryErrorState } from '@/shared/views/query-error-state';

interface MessagesViewProps {
  conversationId: string;
  onSplitConversation: (messageId: string) => void;
  onOpenAttachedFile: (path: string) => void;
}

export const MessagesView = ({
  conversationId,
  onSplitConversation,
  onOpenAttachedFile,
}: MessagesViewProps): React.ReactElement => {
  const { list, phase, error, retry } = useMessagesPanelData(conversationId);
  const { scrollRef, contentRef, isFollowing, jumpToLatest } = useMessagesAutoScroll(
    list,
    conversationId,
  );

  if (phase === MessagesPanelPhase.ColdLoading) {
    return <LoadingState />;
  }
  if (phase === MessagesPanelPhase.Error) {
    return <QueryErrorState error={error} onRetry={retry} />;
  }

  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div ref={contentRef} className="mx-auto max-w-[760px] flex flex-col gap-2.5">
          {list.map(
            (message): React.ReactElement => (
              <MessageRow
                key={message.id}
                message={message}
                onSplitConversation={onSplitConversation}
                onOpenAttachedFile={onOpenAttachedFile}
              />
            ),
          )}
        </div>
      </div>
      {isFollowing ? null : (
        <IconButton
          ariaLabel={translate('messages.jumpToLatest')}
          size="md"
          onClick={jumpToLatest}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-md)]"
        >
          <ArrowDown size={15} strokeWidth={2.2} />
        </IconButton>
      )}
    </div>
  );
};
