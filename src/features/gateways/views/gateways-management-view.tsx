import * as React from 'react';

import { useAgents } from '@/features/agents/queries/use-agents';
import type { Agent } from '@/features/agents/types/agent';
import { useGateways } from '@/features/gateways/queries/use-gateways';
import type { Gateway } from '@/features/gateways/types/gateway';
import { GatewaysList } from '@/features/gateways/views/gateways-list';
import { translate } from '@/shared/i18n/translate';
import { Combobox, type ComboboxOption } from '@/shared/views/combobox';
import { SectionBody } from '@/shared/views/section-body';
import { SectionHeader } from '@/shared/views/section-header';

export interface GatewaysManagementViewProps {
  onAddGateway: () => void;
  onEditGateway: (id: string) => void;
  onDeleteGateway: (gateway: Gateway) => void;
  // Override the header title. Pass null to hide it entirely — used when the
  // view is hosted in a Dialog whose DialogTitle already carries the heading.
  headerTitle?: string | null;
}

const AGENT_FILTER_ALL = '__all__';

export const GatewaysManagementView = ({
  onAddGateway,
  onEditGateway,
  onDeleteGateway,
  headerTitle,
}: GatewaysManagementViewProps): React.ReactElement => {
  const [agentFilter, setAgentFilter] = React.useState<string>(AGENT_FILTER_ALL);
  const [query, setQuery] = React.useState('');

  const gatewaysQuery = useGateways(null);
  const agentsQuery = useAgents();

  const gateways = React.useMemo((): Gateway[] => gatewaysQuery.data ?? [], [gatewaysQuery.data]);
  const agents = React.useMemo((): Agent[] => agentsQuery.data ?? [], [agentsQuery.data]);
  const agentsById = React.useMemo(
    (): Map<string, Agent> => new Map(agents.map((agent): [string, Agent] => [agent.id, agent])),
    [agents],
  );

  const effectiveFilter = React.useMemo((): string => {
    if (agentFilter === AGENT_FILTER_ALL) {
      return AGENT_FILTER_ALL;
    }
    return agentsById.has(agentFilter) ? agentFilter : AGENT_FILTER_ALL;
  }, [agentFilter, agentsById]);

  if (effectiveFilter !== agentFilter) {
    setAgentFilter(effectiveFilter);
  }

  const filteredByAgent = React.useMemo((): Gateway[] => {
    if (effectiveFilter === AGENT_FILTER_ALL) {
      return gateways;
    }
    return gateways.filter((gateway): boolean => gateway.agentId === effectiveFilter);
  }, [gateways, effectiveFilter]);

  const filteredGateways = React.useMemo((): Gateway[] => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) {
      return filteredByAgent;
    }
    return filteredByAgent.filter((gateway): boolean =>
      gateway.name.toLowerCase().includes(trimmed),
    );
  }, [filteredByAgent, query]);

  const filterOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] => [
      { value: AGENT_FILTER_ALL, label: translate('gateways.allAgents') },
      ...agents.map((agent): ComboboxOption => ({ value: agent.id, label: agent.name })),
    ],
    [agents],
  );

  const agentFilterCombobox = (
    <div className="w-[200px]">
      <Combobox
        options={filterOptions}
        value={effectiveFilter}
        onChange={setAgentFilter}
        placeholder={translate('gateways.allAgents')}
        searchPlaceholder={translate('gateways.searchAgents')}
        emptyMessage={translate('gateways.noAgents')}
        size="sm"
      />
    </div>
  );

  const isLoading = gatewaysQuery.isLoading || agentsQuery.isLoading;
  const isError = gatewaysQuery.isError || agentsQuery.isError;
  const error = gatewaysQuery.error ?? agentsQuery.error;
  const isFetching = gatewaysQuery.isFetching || agentsQuery.isFetching;

  const handleRefetch = React.useCallback((): void => {
    void gatewaysQuery.refetch();
    void agentsQuery.refetch();
  }, [gatewaysQuery, agentsQuery]);

  const isRefreshing = isFetching && !isLoading;

  const titleProps =
    headerTitle === null ? {} : { title: headerTitle ?? translate('gateways.title') };

  return (
    <div className="h-full flex flex-col">
      <SectionHeader
        {...titleProps}
        search={{
          value: query,
          onChange: setQuery,
          placeholder: translate('gateways.searchPlaceholder'),
        }}
        filter={agentFilterCombobox}
        onRefresh={handleRefetch}
        isRefreshing={isRefreshing}
        onAdd={onAddGateway}
        addLabel={translate('gateways.addGateway')}
      />
      <SectionBody
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        onRetry={handleRefetch}
      >
        <GatewaysList
          gateways={gateways}
          filteredByAgent={filteredByAgent}
          filteredGateways={filteredGateways}
          query={query}
          agentsById={agentsById}
          onAdd={onAddGateway}
          onEdit={onEditGateway}
          onDelete={onDeleteGateway}
        />
      </SectionBody>
    </div>
  );
};
