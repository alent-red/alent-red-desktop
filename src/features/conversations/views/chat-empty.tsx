import * as React from 'react';

import { Plus } from 'lucide-react';

import { ChatStateWithTopDrag } from '@/features/conversations/views/chat-state-with-top-drag';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Logo } from '@/shared/views/logo';

interface ChatEmptyProps {
  onNewConversation: () => void;
}

export const ChatEmpty = ({ onNewConversation }: ChatEmptyProps): React.ReactElement => {
  return (
    <ChatStateWithTopDrag>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <Logo size={48} />
        <div className="text-[14px] text-secondary max-w-[320px] leading-relaxed">
          {translate('conversations.panelEmptySubtitle')}
        </div>
        <Button variant="primary" onClick={onNewConversation} className="mt-1">
          <Plus size={14} />
          {translate('conversations.panelEmptyCta')}
        </Button>
      </div>
    </ChatStateWithTopDrag>
  );
};
