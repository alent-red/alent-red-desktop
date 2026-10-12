import * as React from 'react';

import { Pencil, Trash2 } from 'lucide-react';

import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { PROVIDER_KIND_ICON } from '@/features/providers/constants/provider-kind-icon';
import type { Provider } from '@/features/providers/types/provider';
import { translate } from '@/shared/i18n/translate';
import { IconButton } from '@/shared/views/icon-button';
import { Tooltip } from '@/shared/views/tooltip';

interface LlmModelRowProps {
  model: LlmModel;
  provider: Provider | undefined;
  onEdit: (id: string) => void;
  onDelete: (model: LlmModel) => void;
}

export const LlmModelRow = ({
  model,
  provider,
  onEdit,
  onDelete,
}: LlmModelRowProps): React.ReactElement => {
  const KindIcon = provider !== undefined ? PROVIDER_KIND_ICON[provider.config.type] : null;
  return (
    <li className="flex items-center justify-between gap-2 rounded-[10px] border border-default bg-surface px-3 py-2">
      <div className="min-w-0 flex-1 flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-secondary shrink-0 px-1.5 py-0.5 rounded-[5px] bg-[var(--bg-active)] truncate max-w-[160px]">
          {KindIcon !== null ? <KindIcon size={11} strokeWidth={2.2} aria-hidden /> : null}
          <span className="truncate">{provider?.name ?? translate('common.none')}</span>
        </span>
        <span className="text-[13.5px] font-medium text-primary truncate">{model.name}</span>
        <span className="text-[11.5px] text-muted truncate font-mono">{model.modelId}</span>
      </div>
      <div className="flex items-center gap-0.5">
        <Tooltip content={translate('common.edit')} side="top">
          <IconButton
            ariaLabel={translate('common.edit')}
            size="sm"
            onClick={(): void => {
              onEdit(model.id);
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
              onDelete(model);
            }}
          >
            <Trash2 size={13} />
          </IconButton>
        </Tooltip>
      </div>
    </li>
  );
};
