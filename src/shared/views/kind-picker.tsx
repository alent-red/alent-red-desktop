import * as React from 'react';

import { type LucideIcon } from 'lucide-react';

import { translate, type TranslationKey } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Tooltip } from '@/shared/views/tooltip';

export interface KindOption<T extends string> {
  value: T;
  labelKey: TranslationKey;
  description?: string;
  icon: LucideIcon;
  disabled?: boolean;
  disabledTooltipKey?: TranslationKey;
}

interface KindPickerProps<T extends string> {
  options: KindOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASSES: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export const KindPicker = <T extends string>({
  options,
  value,
  onChange,
  disabled,
  columns = 2,
}: KindPickerProps<T>): React.ReactElement => {
  return (
    <div role="radiogroup" className={mergeClasses('grid gap-2', COLUMN_CLASSES[columns])}>
      {options.map((option): React.ReactElement => {
        const Icon = option.icon;
        const isSelected = option.value === value;
        const isDisabled = disabled === true || option.disabled === true;
        const hasDescription = option.description !== undefined && option.description.length > 0;
        const tooltipKey = isDisabled ? option.disabledTooltipKey : undefined;
        const button = (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isDisabled}
            onClick={(): void => {
              onChange(option.value);
            }}
            className={mergeClasses(
              'flex items-start gap-2.5 rounded-[10px] border bg-surface px-3 py-2.5 text-left w-full',
              'transition-[border-color,background-color,box-shadow,transform] duration-[140ms]',
              'hover:bg-[var(--bg-hover)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--bg-surface)]',
              isSelected
                ? 'border-[var(--color-brand)] bg-[var(--bg-selected)] shadow-[0_0_0_1px_var(--color-brand)]'
                : 'border-[var(--border-default)]',
            )}
          >
            <span
              className={mergeClasses(
                'inline-flex h-7 w-7 items-center justify-center rounded-[7px] shrink-0',
                isSelected
                  ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)]'
                  : 'bg-[var(--bg-active)] text-[var(--text-secondary)]',
              )}
            >
              <Icon size={13} strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold text-primary truncate">
                {translate(option.labelKey)}
              </div>
              {hasDescription ? (
                <div className="text-[11px] text-muted mt-0.5 leading-snug">
                  {option.description}
                </div>
              ) : null}
            </div>
          </button>
        );
        if (tooltipKey !== undefined) {
          // A disabled button does not dispatch pointer events on its children
          // in all browsers, so we wrap it in a span that Radix's Tooltip can
          // attach its listeners to.
          return (
            <Tooltip key={option.value} content={translate(tooltipKey)} side="top">
              <span className="inline-block w-full">{button}</span>
            </Tooltip>
          );
        }
        return button;
      })}
    </div>
  );
};
