import * as React from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(
  ({ className, children, ...props }, ref): React.ReactElement => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={mergeClasses(
        'inline-flex h-9 w-full items-center justify-between gap-2',
        'rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-input)]',
        'px-3 text-[13px] text-[var(--text-primary)]',
        'data-[placeholder]:text-[var(--text-muted)]',
        'transition-colors duration-[140ms]',
        'hover:bg-[var(--bg-hover)]',
        'focus:outline-none focus:border-[var(--color-brand)] focus:shadow-[0_0_0_3px_var(--color-focus-ring)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={14} className="text-[var(--text-muted)] shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  ),
);
SelectTrigger.displayName = 'SelectTrigger';
