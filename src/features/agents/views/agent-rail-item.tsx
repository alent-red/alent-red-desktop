import * as React from 'react';

import type { Agent } from '@/features/agents/types/agent';
import { AgentAvatar } from '@/features/agents/views/agent-avatar';
import { translate } from '@/shared/i18n/translate';
import { ContextMenu } from '@/shared/views/context-menu';
import { ContextMenuContent } from '@/shared/views/context-menu-content';
import { ContextMenuItem } from '@/shared/views/context-menu-item';
import { ContextMenuSeparator } from '@/shared/views/context-menu-separator';
import { ContextMenuTrigger } from '@/shared/views/context-menu-trigger';
import { Tooltip } from '@/shared/views/tooltip';

interface AgentRailItemProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AgentRailItem = ({
  agent,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: AgentRailItemProps): React.ReactElement => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <li role="option" aria-selected={isSelected} className="flex items-center justify-center">
          <Tooltip content={agent.name}>
            <button
              type="button"
              aria-label={agent.name}
              onClick={onSelect}
              className="block focus-visible:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-rail)]"
            >
              <AgentAvatar
                name={agent.name}
                pictureFileKey={agent.pictureFileKey}
                size={40}
                isSelected={isSelected}
              />
            </button>
          </Tooltip>
        </li>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onEdit}>{translate('agents.edit')}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="danger" onSelect={onDelete}>
          {translate('agents.delete')}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
