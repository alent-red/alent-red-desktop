import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(
  ({ className, ...props }, ref): React.ReactElement => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={mergeClasses(
        'peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]',
        'border border-[var(--border-strong)] bg-[var(--bg-input)]',
        'transition-colors duration-[140ms]',
        'data-[state=checked]:bg-[var(--color-brand)] data-[state=checked]:border-[var(--color-brand)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[var(--color-brand-foreground)]">
        <Check size={11} strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);

Checkbox.displayName = 'Checkbox';
