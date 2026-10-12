import * as React from 'react';

import type { Agent } from '@/features/agents/types/agent';
import type { Gateway } from '@/features/gateways/types/gateway';
import { GatewayRow } from '@/features/gateways/views/gateway-row';
import { GatewaysEmptyState } from '@/features/gateways/views/gateways-empty-state';
import { translate } from '@/shared/i18n/translate';

interface GatewaysListProps {
  gateways: Gateway[];
  filteredByAgent: Gateway[];
  filteredGateways: Gateway[];
  query: string;
  agentsById: Map<string, Agent>;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (gateway: Gateway) => void;
}

export const GatewaysList = ({
  gateways,
  filteredByAgent,
  filteredGateways,
  query,
  agentsById,
  onAdd,
  onEdit,
  onDelete,
}: GatewaysListProps): React.ReactElement => {
  if (gateways.length === 0) {
    return <GatewaysEmptyState onAdd={onAdd} />;
  }
  if (filteredByAgent.length === 0) {
    return (
      <div className="text-muted text-[12.5px] text-center py-8">
        {translate('gateways.noGatewaysForAgent')}
      </div>
    );
  }
  if (filteredGateways.length === 0) {
    return (
      <div className="text-muted text-[12.5px] text-center py-8">
        {translate('gateways.noGatewaysMatching', { query: query.trim() })}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {filteredGateways.map(
        (gateway): React.ReactElement => (
          <GatewayRow
            key={gateway.id}
            gateway={gateway}
            agent={agentsById.get(gateway.agentId)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ),
      )}
    </ul>
  );
};
