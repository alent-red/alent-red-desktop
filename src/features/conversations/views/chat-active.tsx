import * as React from 'react';

import { Pause } from 'lucide-react';

import { useAgent } from '@/features/agents/queries/use-agent';
import type { Agent } from '@/features/agents/types/agent';
import { AgentAvatar } from '@/features/agents/views/agent-avatar';
import { AgentUnassignedAvatar } from '@/features/agents/views/agent-unassigned-avatar';
import { ConversationLivePhase } from '@/features/conversations/data/conversation-live-phase';
import { useConversationLiveData } from '@/features/conversations/data/use-conversation-live-data';
import { usePauseConversation } from '@/features/conversations/queries/use-pause-conversation';
import type { Conversation } from '@/features/conversations/types/conversation';
import { ChatStateWithTopDrag } from '@/features/conversations/views/chat-state-with-top-drag';
import { ConversationAvatar } from '@/features/conversations/views/conversation-avatar';
import { ConversationErrorBanner } from '@/features/conversations/views/conversation-error-banner';
import { ConversationMenu } from '@/features/conversations/views/conversation-menu';
import { useGateway } from '@/features/gateways/queries/use-gateway';
import type { Gateway } from '@/features/gateways/types/gateway';
import { useLlmModel } from '@/features/llm-models/queries/use-llm-model';
import { MessageComposer } from '@/features/messages/views/message-composer';
import { MessagesView } from '@/features/messages/views/messages-view';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { AppError } from '@/shared/invoke/app-error';
import { isWindowsPlatform } from '@/shared/lib/is-windows-platform';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { ErrorCode } from '@/shared/types/error-code';
import { IconButton } from '@/shared/views/icon-button';
import { LoadingState } from '@/shared/views/loading-state';
import { QueryErrorState } from '@/shared/views/query-error-state';
import { Tooltip } from '@/shared/views/tooltip';

interface ChatActiveProps {
  conversationId: string;
  onEdit: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onConversationGone: () => void;
  onSplitConversation: (messageId: string) => void;
  onOpenAttachedFile: (path: string) => void;
}

interface ChatActiveContentProps {
  conversation: Conversation;
  agent: Agent | null;
  gateway: Gateway | null;
  conversationId: string;
  onEdit: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onSplitConversation: (messageId: string) => void;
  onOpenAttachedFile: (path: string) => void;
}

function renderHeaderAvatar(
  conversation: Conversation,
  agent: Agent | null,
  gateway: Gateway | null,
): React.ReactElement {
  if (conversation.sender !== null) {
    return (
      <ConversationAvatar agent={agent} sender={conversation.sender} gateway={gateway} size={32} />
    );
  }
  if (agent !== null) {
    return <AgentAvatar name={agent.name} pictureFileKey={agent.pictureFileKey} size={32} />;
  }
  return <AgentUnassignedAvatar size={32} />;
}

function computeHeaderPrimaryText(agent: Agent | null): string {
  return agent?.name ?? translate('agents.unassignedName');
}

function computeHeaderSecondaryText(conversation: Conversation): string {
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

const ChatActiveContent = ({
  conversation,
  agent,
  gateway,
  conversationId,
  onEdit,
  onDelete,
  onSplitConversation,
  onOpenAttachedFile,
}: ChatActiveContentProps): React.ReactElement => {
  const pause = usePauseConversation();
  const llmModelQuery = useLlmModel(agent?.llmModelId);

  const runPause = async (): Promise<void> => {
    try {
      await pause.mutateAsync(conversationId);
    } catch (caught) {
      toastError(caught);
    }
  };

  const handlePause = (): void => {
    void runPause();
  };

  return (
    <>
      <header className="flex items-center gap-2.5 border-b border-subtle px-4 py-2.5 bg-surface">
        {renderHeaderAvatar(conversation, agent, gateway)}
        <div className="min-w-0 max-w-[50%]">
          <div className="text-[13.5px] font-semibold text-primary truncate">
            {computeHeaderPrimaryText(agent)}
          </div>
          <div className="text-[11.5px] text-muted truncate">
            {computeHeaderSecondaryText(conversation)}
          </div>
        </div>
        <div className="flex-1 self-stretch" data-tauri-drag-region aria-hidden />
        <div
          className={mergeClasses(
            'flex items-center',
            isWindowsPlatform()
              ? '-mt-2.5 self-start pr-[calc(var(--tauri-frame-controls-width,0px)-16px)]'
              : 'gap-1',
          )}
        >
          {conversation.processing ? (
            <Tooltip content={translate('messages.pause')} side="top">
              <IconButton
                ariaLabel={translate('messages.pause')}
                size={isWindowsPlatform() ? 'windowsCaption' : 'sm'}
                className="!text-[var(--color-brand)]"
                onClick={handlePause}
              >
                <Pause size={14} strokeWidth={2.1} />
              </IconButton>
            </Tooltip>
          ) : null}
          <ConversationMenu
            onEdit={(): void => {
              onEdit(conversationId);
            }}
            onDelete={(): void => {
              onDelete(conversationId);
            }}
          />
        </div>
      </header>

      {conversation.errorCode !== null ? (
        <ConversationErrorBanner
          errorCode={conversation.errorCode}
          message={conversation.errorMessage}
        />
      ) : null}

      <MessagesView
        conversationId={conversationId}
        onSplitConversation={onSplitConversation}
        onOpenAttachedFile={onOpenAttachedFile}
      />
      <MessageComposer
        conversationId={conversationId}
        contextTokensCount={conversation.contextTokensCount}
        contextWindowTokensCount={llmModelQuery.data?.contextWindowTokensCount ?? null}
      />
    </>
  );
};

const isNotFound = (error: unknown): boolean => {
  return error instanceof AppError && error.code === ErrorCode.NotFound;
};

export const ChatActive = ({
  conversationId,
  onEdit,
  onDelete,
  onConversationGone,
  onSplitConversation,
  onOpenAttachedFile,
}: ChatActiveProps): React.ReactElement => {
  const { conversation, phase, error, retry } = useConversationLiveData(
    conversationId,
    onConversationGone,
  );

  const linkedAgentId = conversation?.agentId ?? null;
  const agentQuery = useAgent(linkedAgentId);
  const isAgentNotFound = agentQuery.isError && isNotFound(agentQuery.error);
  const isAgentLoadingFirstTime =
    linkedAgentId !== null &&
    agentQuery.data === undefined &&
    !isAgentNotFound &&
    !agentQuery.isError;
  const hasAgentOtherError =
    agentQuery.isError && !isAgentNotFound && agentQuery.data === undefined;
  const agent: Agent | null = agentQuery.data ?? null;

  const linkedGatewayId = conversation?.gatewayId ?? null;
  const gatewayQuery = useGateway(linkedGatewayId);
  const gateway: Gateway | null = gatewayQuery.data ?? null;

  const isLivePending =
    phase === ConversationLivePhase.ColdLoading || phase === ConversationLivePhase.WarmLoading;
  const showLoading = (isLivePending && conversation === null) || isAgentLoadingFirstTime;
  const showError = phase === ConversationLivePhase.Error || hasAgentOtherError;
  const displayedError = phase === ConversationLivePhase.Error ? error : agentQuery.error;
  const handleRetry = (): void => {
    if (phase === ConversationLivePhase.Error) {
      retry();
    }
    if (hasAgentOtherError) {
      void agentQuery.refetch();
    }
  };
  const showContent = conversation !== null && !showLoading && !showError;

  if (showLoading) {
    return (
      <ChatStateWithTopDrag>
        <LoadingState />
      </ChatStateWithTopDrag>
    );
  }
  if (showError) {
    return (
      <ChatStateWithTopDrag>
        <QueryErrorState error={displayedError} onRetry={handleRetry} />
      </ChatStateWithTopDrag>
    );
  }
  if (showContent) {
    return (
      <ChatActiveContent
        conversation={conversation}
        agent={agent}
        gateway={gateway}
        conversationId={conversationId}
        onEdit={onEdit}
        onDelete={onDelete}
        onSplitConversation={onSplitConversation}
        onOpenAttachedFile={onOpenAttachedFile}
      />
    );
  }
  return (
    <ChatStateWithTopDrag>
      <LoadingState />
    </ChatStateWithTopDrag>
  );
};
