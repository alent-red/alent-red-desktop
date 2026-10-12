import * as React from 'react';

import type { ThemeOption } from '@/features/theme/constants/theme-options';
import { mergeClasses } from '@/shared/lib/merge-classes';

interface ThemeCardProps {
  option: ThemeOption;
  isSelected: boolean;
  onSelect: () => void;
}

export const ThemeCard = ({ option, isSelected, onSelect }: ThemeCardProps): React.ReactElement => {
  const Icon = option.icon;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={mergeClasses(
        'flex flex-col items-start gap-2 rounded-[12px] border bg-surface px-3.5 py-3 text-left',
        'transition-[border-color,background-color,box-shadow,transform] duration-[160ms]',
        'hover:bg-[var(--bg-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
        isSelected
          ? 'border-[var(--color-brand)] shadow-[0_0_0_1px_var(--color-brand)] bg-[var(--bg-selected)]'
          : 'border-[var(--border-default)]',
      )}
    >
      <span
        className={mergeClasses(
          'inline-flex h-7 w-7 items-center justify-center rounded-[7px]',
          isSelected
            ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)]'
            : 'bg-[var(--bg-active)] text-[var(--text-secondary)]',
        )}
      >
        <Icon size={14} strokeWidth={2} />
      </span>
      <div>
        <div className="text-[13px] font-semibold text-primary">{option.label}</div>
        <div className="text-[11.5px] text-muted mt-0.5 leading-snug">{option.description}</div>
      </div>
    </button>
  );
};
