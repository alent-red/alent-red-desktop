import * as React from 'react';

import { useAgents } from '@/features/agents/queries/use-agents';
import type { Agent } from '@/features/agents/types/agent';
import { ConversationsPanelPhase } from '@/features/conversations/data/conversations-panel-phase';
import { useConversationsPanelData } from '@/features/conversations/data/use-conversations-panel-data';
import type { Conversation } from '@/features/conversations/types/conversation';
import { ConversationRow } from '@/features/conversations/views/conversation-row';
import { ConversationsEmptyState } from '@/features/conversations/views/conversations-empty-state';
import { useGateways } from '@/features/gateways/queries/use-gateways';
import type { Gateway } from '@/features/gateways/types/gateway';
import { translate } from '@/shared/i18n/translate';
import { LoadingState } from '@/shared/views/loading-state';
import { QueryErrorState } from '@/shared/views/query-error-state';
import { ScrollArea } from '@/shared/views/scroll-area';

interface ConversationsListProps {
  query: string;
  agentFilter: string | null;
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string | null) => void;
  onEdit: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
}

export const ConversationsList = ({
  query,
  agentFilter,
  selectedConversationId,
  onSelectConversation,
  onEdit,
  onDelete,
}: ConversationsListProps): React.ReactElement => {
  const { list, phase, error, retry } = useConversationsPanelData();

  const agentsQuery = useAgents();
  const agents = React.useMemo((): Agent[] => agentsQuery.data ?? [], [agentsQuery.data]);
  const agentsById = React.useMemo(
    (): Map<string, Agent> => new Map(agents.map((agent): [string, Agent] => [agent.id, agent])),
    [agents],
  );

  const gatewaysQuery = useGateways(null);
  const gateways = React.useMemo((): Gateway[] => gatewaysQuery.data ?? [], [gatewaysQuery.data]);
  const gatewaysById = React.useMemo(
    (): Map<string, Gateway> =>
      new Map(gateways.map((gateway): [string, Gateway] => [gateway.id, gateway])),
    [gateways],
  );

  const isAgentsLoading = agentsQuery.isLoading;
  const hasAgentsError = agentsQuery.isError && agentsQuery.data === undefined;

  const showLoading = phase === ConversationsPanelPhase.ColdLoading || isAgentsLoading;
  const showError = phase === ConversationsPanelPhase.Error || hasAgentsError;
  const displayedError = phase === ConversationsPanelPhase.Error ? error : agentsQuery.error;

  const handleRetry = React.useCallback((): void => {
    if (hasAgentsError) {
      void agentsQuery.refetch();
    }
    if (phase === ConversationsPanelPhase.Error) {
      retry();
    }
  }, [hasAgentsError, agentsQuery, phase, retry]);

  const filtered = React.useMemo((): Conversation[] => {
    const trimmed = query.trim().toLowerCase();
    return list.filter((conversation): boolean => {
      const linkedAgent =
        conversation.agentId !== null ? agentsById.get(conversation.agentId) : undefined;
      const effectiveAgentId = linkedAgent?.id ?? null;
      if (agentFilter !== null && effectiveAgentId !== agentFilter) {
        return false;
      }
      if (trimmed.length === 0) {
        return true;
      }
      const agentName = linkedAgent?.name ?? translate('agents.unassignedName');
      return (
        (conversation.name ?? '').toLowerCase().includes(trimmed) ||
        agentName.toLowerCase().includes(trimmed)
      );
    });
  }, [list, agentsById, agentFilter, query]);

  if (showLoading) {
    return <LoadingState />;
  }
  if (showError) {
    return <QueryErrorState error={displayedError} onRetry={handleRetry} />;
  }
  return (
    <ScrollArea className="flex-1">
      {filtered.length === 0 ? (
        <ConversationsEmptyState
          agentFilter={agentFilter}
          agentName={agentFilter !== null ? agentsById.get(agentFilter)?.name : undefined}
          query={query}
          hasAnyAgent={agents.length > 0}
        />
      ) : (
        <ul
          className="flex flex-col px-2 pb-2.5"
          role="listbox"
          aria-label={translate('conversations.list')}
        >
          {filtered.map(
            (conversation): React.ReactElement => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                agent={
                  conversation.agentId !== null ? agentsById.get(conversation.agentId) : undefined
                }
                gateway={
                  conversation.gatewayId !== null
                    ? gatewaysById.get(conversation.gatewayId)
                    : undefined
                }
                isSelected={conversation.id === selectedConversationId}
                onSelect={(): void => {
                  onSelectConversation(conversation.id);
                }}
                onEdit={(): void => {
                  onEdit(conversation.id);
                }}
                onDelete={(): void => {
                  onDelete(conversation.id);
                }}
              />
            ),
          )}
        </ul>
      )}
    </ScrollArea>
  );
};
