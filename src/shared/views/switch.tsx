import * as React from 'react';

import * as SwitchPrimitive from '@radix-ui/react-switch';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(
  ({ className, ...props }, ref): React.ReactElement => (
    <SwitchPrimitive.Root
      ref={ref}
      className={mergeClasses(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
        'border border-transparent bg-[var(--border-strong)]',
        'transition-colors duration-[140ms]',
        'data-[state=checked]:bg-[var(--color-brand)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={mergeClasses(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm',
          'transition-transform duration-[140ms]',
          'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5',
        )}
      />
    </SwitchPrimitive.Root>
  ),
);

Switch.displayName = 'Switch';
