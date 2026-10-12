import * as React from 'react';

import { Pencil, Trash2 } from 'lucide-react';

import { PROVIDER_KIND_ICON } from '@/features/providers/constants/provider-kind-icon';
import { describeProvider } from '@/features/providers/lib/describe-provider';
import type { Provider } from '@/features/providers/types/provider';
import { translate } from '@/shared/i18n/translate';
import { IconButton } from '@/shared/views/icon-button';
import { Tooltip } from '@/shared/views/tooltip';

interface ProviderRowProps {
  provider: Provider;
  onEdit: (id: string) => void;
  onDelete: (provider: Provider) => void;
}

export const ProviderRow = ({
  provider,
  onEdit,
  onDelete,
}: ProviderRowProps): React.ReactElement => {
  const KindIcon = PROVIDER_KIND_ICON[provider.config.type];
  return (
    <li className="flex items-center justify-between gap-2 rounded-[10px] border border-default bg-surface px-3 py-2">
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-[var(--bg-active)] text-[var(--text-secondary)] shrink-0"
      >
        <KindIcon size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium text-primary truncate">{provider.name}</div>
        <div className="text-[11.5px] text-muted truncate">{describeProvider(provider)}</div>
      </div>
      <div className="flex items-center gap-0.5">
        <Tooltip content={translate('common.edit')} side="top">
          <IconButton
            ariaLabel={translate('common.edit')}
            size="sm"
            onClick={(): void => {
              onEdit(provider.id);
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
              onDelete(provider);
            }}
          >
            <Trash2 size={13} />
          </IconButton>
        </Tooltip>
      </div>
    </li>
  );
};
