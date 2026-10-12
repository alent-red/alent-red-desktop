import * as React from 'react';

import { Pencil, Trash2 } from 'lucide-react';

import { BRICK_KIND_ICON } from '@/features/bricks/constants/brick-kind-icon';
import { BRICK_KIND_LABEL_KEY } from '@/features/bricks/constants/brick-kind-label-key';
import type { Brick } from '@/features/bricks/types/brick';
import { BrickConfigType } from '@/features/bricks/types/brick-config-type';
import { translate } from '@/shared/i18n/translate';
import { IconButton } from '@/shared/views/icon-button';
import { Tooltip } from '@/shared/views/tooltip';

interface BrickRowProps {
  brick: Brick;
  onEdit: (id: string) => void;
  onDelete: (brick: Brick) => void;
}

export const BrickRow = ({ brick, onEdit, onDelete }: BrickRowProps): React.ReactElement => {
  const KindIcon = BRICK_KIND_ICON[brick.config.type];
  const customSuffix =
    brick.config.type === BrickConfigType.Custom ? ` · ${brick.config.path}` : null;
  return (
    <li className="flex items-center justify-between gap-2 rounded-[10px] border border-default bg-surface px-3 py-2">
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-[7px] bg-[var(--bg-active)] text-[var(--text-secondary)] shrink-0"
      >
        <KindIcon size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium text-primary truncate">{brick.name}</div>
        <div className="text-[11.5px] text-muted truncate">
          {translate(BRICK_KIND_LABEL_KEY[brick.config.type])}
          {customSuffix}
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <Tooltip content={translate('common.edit')} side="top">
          <IconButton
            ariaLabel={translate('common.edit')}
            size="sm"
            onClick={(): void => {
              onEdit(brick.id);
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
              onDelete(brick);
            }}
          >
            <Trash2 size={13} />
          </IconButton>
        </Tooltip>
      </div>
    </li>
  );
};
