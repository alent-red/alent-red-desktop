import * as React from 'react';

import { Plus, RefreshCw, Search } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Button } from '@/shared/views/button';
import { IconButton } from '@/shared/views/icon-button';
import { Input } from '@/shared/views/input';
import { Tooltip } from '@/shared/views/tooltip';

interface SectionHeaderSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface SectionHeaderProps {
  // Optional because the header is sometimes hosted in a Dialog where the
  // dialog's own title carries the heading; here only the search/add chrome
  // is needed.
  title?: string;
  search?: SectionHeaderSearchProps;
  filter?: React.ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onAdd?: () => void;
  addLabel?: string;
}

export const SectionHeader = ({
  title,
  search,
  filter,
  onRefresh,
  isRefreshing = false,
  onAdd,
  addLabel,
}: SectionHeaderProps): React.ReactElement => {
  return (
    <header className="flex items-center gap-2 px-6 pb-3 border-b border-subtle shrink-0">
      {title !== undefined ? (
        <h2 className="text-[14.5px] font-semibold tracking-tight shrink-0">{title}</h2>
      ) : null}
      <div className="flex-1" />
      {onRefresh !== undefined ? (
        <Tooltip content={translate('common.refresh')}>
          <IconButton
            ariaLabel={translate('common.refresh')}
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={13}
              strokeWidth={2.1}
              className={mergeClasses(isRefreshing && 'animate-[spin_900ms_linear_infinite]')}
            />
          </IconButton>
        </Tooltip>
      ) : null}
      {search !== undefined ? (
        <div className="relative w-[220px]">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            strokeWidth={2.1}
          />
          <Input
            value={search.value}
            onChange={(event): void => {
              search.onChange(event.target.value);
            }}
            placeholder={search.placeholder}
            className="pl-8 h-8 text-[12.5px]"
          />
        </div>
      ) : null}
      {filter !== undefined && filter !== null ? <div className="shrink-0">{filter}</div> : null}
      {onAdd !== undefined ? (
        <Button size="sm" onClick={onAdd}>
          <Plus size={13} />
          {addLabel ?? translate('common.add')}
        </Button>
      ) : null}
    </header>
  );
};
