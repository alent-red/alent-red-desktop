import * as React from 'react';

import { Boxes, Plus, Search } from 'lucide-react';

import { BRICK_KIND_ICON } from '@/features/bricks/constants/brick-kind-icon';
import { BRICK_KIND_LABEL_KEY } from '@/features/bricks/constants/brick-kind-label-key';
import type { Brick } from '@/features/bricks/types/brick';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Button } from '@/shared/views/button';
import { Input } from '@/shared/views/input';

interface BrickSelectorProps {
  bricks: Brick[];
  selectedBrickIds: Set<string>;
  onChange: (next: Set<string>) => void;
  onOpenSettings: () => void;
  className?: string;
  disabled?: boolean;
}

export const BrickSelector = ({
  bricks,
  selectedBrickIds,
  onChange,
  onOpenSettings,
  className,
  disabled,
}: BrickSelectorProps): React.ReactElement => {
  const [query, setQuery] = React.useState('');

  const filteredBricks = React.useMemo((): Brick[] => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed === '') {
      return bricks;
    }
    return bricks.filter((brick): boolean => brick.name.toLowerCase().includes(trimmed));
  }, [bricks, query]);

  const toggleBrick = (brickId: string): void => {
    const next = new Set(selectedBrickIds);
    if (next.has(brickId)) {
      next.delete(brickId);
    } else {
      next.add(brickId);
    }
    onChange(next);
  };

  if (bricks.length === 0) {
    return (
      <div
        className={mergeClasses(
          'rounded-[10px] border border-default bg-input p-6',
          'flex flex-col items-center justify-center gap-2 text-center',
          className,
        )}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-active)] text-[var(--text-muted)]">
          <Boxes size={18} strokeWidth={2} aria-hidden />
        </span>
        <div className="text-[13px] font-medium text-primary">
          {translate('bricks.noBricksSelectorTitle')}
        </div>
        <div className="text-[11.5px] text-muted max-w-[260px] leading-relaxed">
          {translate('bricks.noBricksSelectorBody')}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenSettings}
          className="mt-1"
          disabled={disabled}
        >
          <Plus size={13} strokeWidth={2.2} />
          {translate('bricks.openSettings')}
        </Button>
      </div>
    );
  }

  return (
    <div className={mergeClasses('flex flex-col gap-2', className)}>
      <div className="relative">
        <Search
          size={13}
          strokeWidth={2.1}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <Input
          value={query}
          onChange={(event): void => {
            setQuery(event.target.value);
          }}
          placeholder={translate('bricks.searchBricks')}
          className="pl-8 h-8 text-[12.5px]"
          disabled={disabled}
        />
      </div>
      {filteredBricks.length === 0 ? (
        <div className="px-3 py-6 text-center text-[12.5px] text-muted">
          {translate('bricks.noBricksMatching', { query: query.trim() })}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredBricks.map((brick): React.ReactElement => {
            const KindIcon = BRICK_KIND_ICON[brick.config.type];
            const isSelected = selectedBrickIds.has(brick.id);
            return (
              <li key={brick.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  disabled={disabled}
                  onClick={(): void => {
                    toggleBrick(brick.id);
                  }}
                  className={mergeClasses(
                    'w-full flex items-center gap-2.5 rounded-[10px] border bg-surface px-3 py-2 text-left',
                    'transition-[border-color,background-color,box-shadow] duration-[140ms]',
                    'hover:bg-[var(--bg-hover)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface',
                    isSelected
                      ? 'border-[var(--color-brand)] bg-[var(--bg-selected)] shadow-[0_0_0_1px_var(--color-brand)]'
                      : 'border-[var(--border-default)]',
                  )}
                >
                  <span
                    aria-hidden
                    className={mergeClasses(
                      'inline-flex h-7 w-7 items-center justify-center rounded-[7px] shrink-0',
                      isSelected
                        ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)]'
                        : 'bg-[var(--bg-active)] text-[var(--text-secondary)]',
                    )}
                  >
                    <KindIcon size={13} strokeWidth={2.1} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-primary truncate">
                      {brick.name}
                    </div>
                    <div className="text-[11px] text-muted truncate">
                      {translate(BRICK_KIND_LABEL_KEY[brick.config.type])}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
