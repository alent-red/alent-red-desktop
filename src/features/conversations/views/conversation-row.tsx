import * as React from 'react';

import { AlertCircle } from 'lucide-react';

import type { Agent } from '@/features/agents/types/agent';
import { AgentAvatar } from '@/features/agents/views/agent-avatar';
import { AgentUnassignedAvatar } from '@/features/agents/views/agent-unassigned-avatar';
import type { Conversation } from '@/features/conversations/types/conversation';
import { ConversationAvatar } from '@/features/conversations/views/conversation-avatar';
import type { Gateway } from '@/features/gateways/types/gateway';
import { translate } from '@/shared/i18n/translate';
import { formatRelativeTimestamp } from '@/shared/lib/format-relative-timestamp';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { ContextMenu } from '@/shared/views/context-menu';
import { ContextMenuContent } from '@/shared/views/context-menu-content';
import { ContextMenuItem } from '@/shared/views/context-menu-item';
import { ContextMenuSeparator } from '@/shared/views/context-menu-separator';
import { ContextMenuTrigger } from '@/shared/views/context-menu-trigger';
import { Spinner } from '@/shared/views/spinner';
import { Tooltip } from '@/shared/views/tooltip';

interface ConversationRowProps {
  conversation: Conversation;
  agent: Agent | undefined;
  gateway: Gateway | undefined;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function computeSecondaryText(conversation: Conversation): string {
  const sender = conversation.sender;
  const fallback = conversation.name ?? translate('conversations.untitled');
  if (sender === null) {
    return fallback;
  }
  const hasUserName = sender.userName !== null && sender.userName.length > 0;
  const hasName = sender.name !== null && sender.name.length > 0;
  if (hasUserName && hasName) {
    return `@${sender.userName ?? ''} - ${sender.name ?? ''}`;
  }
  if (hasUserName) {
    return `@${sender.userName ?? ''}`;
  }
  if (hasName) {
    return sender.name ?? '';
  }
  return fallback;
}

interface RenderAvatarArgs {
  agent: Agent | undefined;
  sender: Conversation['sender'];
  gateway: Gateway | undefined;
}

function renderAvatar({ agent, sender, gateway }: RenderAvatarArgs): React.ReactElement {
  if (sender !== null) {
    return (
      <ConversationAvatar
        agent={agent ?? null}
        sender={sender}
        gateway={gateway ?? null}
        size={36}
      />
    );
  }
  if (agent === undefined) {
    return <AgentUnassignedAvatar size={36} />;
  }
  return <AgentAvatar name={agent.name} pictureFileKey={agent.pictureFileKey} size={36} />;
}

export const ConversationRow = ({
  conversation,
  agent,
  gateway,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: ConversationRowProps): React.ReactElement => {
  const sender = conversation.sender;
  const agentName = agent?.name ?? translate('agents.unassignedName');
  const hasError = conversation.errorCode !== null;
  const isProcessing = conversation.processing;

  const secondaryText = computeSecondaryText(conversation);

  const renderStatusIndicator = (): React.ReactElement | null => {
    if (hasError) {
      return (
        <Tooltip content={translate('conversations.hasError')}>
          <span className="text-[var(--color-danger)] shrink-0">
            <AlertCircle size={13} strokeWidth={2.1} />
          </span>
        </Tooltip>
      );
    }
    if (isProcessing) {
      return (
        <Tooltip content={translate('conversations.processing')}>
          <span className="text-[var(--color-brand)] shrink-0">
            <Spinner size={11} className="text-current" />
          </span>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <li
          role="option"
          aria-selected={isSelected}
          tabIndex={0}
          onClick={onSelect}
          onKeyDown={(event: React.KeyboardEvent<HTMLLIElement>): void => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect();
            }
          }}
          className={mergeClasses(
            'flex items-center gap-2.5 rounded-[10px] px-2 py-2 mb-0.5 cursor-pointer',
            'transition-colors duration-[140ms]',
            'hover:bg-[var(--bg-hover)]',
            isSelected && 'bg-[var(--bg-selected)] hover:bg-[var(--bg-selected)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-0',
          )}
        >
          {renderAvatar({ agent, sender, gateway })}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <div className="flex-1 min-w-0 text-[13px] font-semibold text-primary truncate">
                {agentName}
              </div>
              <div className="text-[11px] text-muted shrink-0 tabular-nums">
                {formatRelativeTimestamp(conversation.updatedAt)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex-1 min-w-0 text-[12px] text-secondary truncate">
                {secondaryText}
              </div>
              {renderStatusIndicator()}
            </div>
          </div>
        </li>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onEdit}>{translate('conversations.edit')}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="danger" onSelect={onDelete}>
          {translate('conversations.delete')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
