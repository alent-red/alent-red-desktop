import * as React from 'react';

import { useAgents } from '@/features/agents/queries/use-agents';
import type { Agent } from '@/features/agents/types/agent';
import { AgentRailErrorIndicator } from '@/features/agents/views/agent-rail-error-indicator';
import { AgentRailItem } from '@/features/agents/views/agent-rail-item';
import { translate } from '@/shared/i18n/translate';
import { Spinner } from '@/shared/views/spinner';

interface AgentRailListProps {
  agentFilter: string | null;
  onSelectAgent: (agentId: string | null) => void;
  onEdit: (agentId: string) => void;
  onDelete: (agentId: string) => void;
}

export const AgentRailList = ({
  agentFilter,
  onSelectAgent,
  onEdit,
  onDelete,
}: AgentRailListProps): React.ReactElement => {
  const { data: agentsData, isLoading, isError, error, isFetching, refetch } = useAgents();
  const agents = React.useMemo((): Agent[] => agentsData ?? [], [agentsData]);
  const hasData = agentsData !== undefined;
  const showLoading = isLoading && !hasData;
  const showError = isError && !hasData;

  React.useEffect((): void => {
    if (!hasData) {
      return;
    }
    if (agentFilter === null) {
      return;
    }
    if (agents.some((agent): boolean => agent.id === agentFilter)) {
      return;
    }
    onSelectAgent(null);
  }, [hasData, agents, agentFilter, onSelectAgent]);

  return (
    <ul
      role="listbox"
      aria-label={translate('agents.listLabel')}
      className="flex flex-col items-center gap-2.5 px-2 py-2.5"
    >
      {showLoading ? (
        <li className="flex h-10 w-10 items-center justify-center">
          <Spinner size={16} className="text-[var(--color-brand)]" />
        </li>
      ) : null}

      {showError ? (
        <li>
          <AgentRailErrorIndicator
            error={error}
            isRetrying={isFetching}
            onRetry={(): void => {
              void refetch();
            }}
          />
        </li>
      ) : null}

      {agents.map(
        (agent): React.ReactElement => (
          <AgentRailItem
            key={agent.id}
            agent={agent}
            isSelected={agentFilter === agent.id}
            onSelect={(): void => {
              onSelectAgent(agent.id);
            }}
            onEdit={(): void => {
              onEdit(agent.id);
            }}
            onDelete={(): void => {
              onDelete(agent.id);
            }}
          />
        ),
      )}
    </ul>
  );
};
