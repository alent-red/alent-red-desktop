import * as React from 'react';

import { AlertCircle, Pencil, Trash2 } from 'lucide-react';

import type { Agent } from '@/features/agents/types/agent';
import { GATEWAY_KIND_ICON } from '@/features/gateways/constants/gateway-kind-icon';
import { GATEWAY_KIND_LABEL_KEY } from '@/features/gateways/constants/gateway-kind-label-key';
import type { Gateway } from '@/features/gateways/types/gateway';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { AppError } from '@/shared/invoke/app-error';
import { IconButton } from '@/shared/views/icon-button';
import { Tooltip } from '@/shared/views/tooltip';

interface GatewayRowProps {
  gateway: Gateway;
  agent: Agent | undefined;
  onEdit: (id: string) => void;
  onDelete: (gateway: Gateway) => void;
}

export const GatewayRow = ({
  gateway,
  agent,
  onEdit,
  onDelete,
}: GatewayRowProps): React.ReactElement => {
  const KindIcon = GATEWAY_KIND_ICON[gateway.config.type];
  const kindLabel = translate(GATEWAY_KIND_LABEL_KEY[gateway.config.type]);
  const agentName = agent?.name ?? translate('agents.unassignedName');
  const hasError = gateway.errorCode !== null;

  const handleErrorClick = (): void => {
    if (gateway.errorCode === null) {
      return;
    }
    toastError(new AppError({ code: gateway.errorCode, message: gateway.errorMessage }));
  };

  return (
    <li className="flex items-center justify-between gap-2 rounded-[10px] border border-default bg-surface px-3 py-2">
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-[var(--bg-active)] text-[var(--text-secondary)] shrink-0"
      >
        <KindIcon size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium text-primary truncate">{gateway.name}</div>
        <div className="text-[11.5px] text-muted truncate">
          {kindLabel} · {agentName}
        </div>
      </div>
      {hasError ? (
        <Tooltip content={translate('gateways.hasError')} side="top">
          <button
            type="button"
            aria-label={translate('gateways.hasError')}
            onClick={handleErrorClick}
            className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
          >
            <AlertCircle size={14} strokeWidth={2.1} />
          </button>
        </Tooltip>
      ) : null}
      <div className="flex items-center gap-0.5">
        <Tooltip content={translate('common.edit')} side="top">
          <IconButton
            ariaLabel={translate('common.edit')}
            size="sm"
            onClick={(): void => {
              onEdit(gateway.id);
            }}
          >
            <Pencil size={13} />
          </IconButton>
        </Tooltip>
        <Tooltip content={translate('common.delete')} side="top">
          <IconButton
            ariaLabel={translate('common.delete')}
            size="sm"
            className="hover:!text-[var(--color-danger)]"
            onClick={(): void => {
              onDelete(gateway);
            }}
          >
            <Trash2 size={13} />
          </IconButton>
        </Tooltip>
      </div>
    </li>
  );
};
