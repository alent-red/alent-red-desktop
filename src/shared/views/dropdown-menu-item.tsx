import * as React from 'react';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { mergeClasses } from '@/shared/lib/merge-classes';

interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> {
  variant?: 'default' | 'danger';
}

export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(
  ({ className, variant = 'default', ...props }, ref): React.ReactElement => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={mergeClasses(
        'flex items-center gap-2 rounded-[6px] px-2 py-1.5',
        'text-[13px] text-[var(--text-primary)]',
        'cursor-pointer outline-none transition-colors duration-[120ms]',
        'data-[highlighted]:bg-[var(--bg-hover)]',
        'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
        variant === 'danger' &&
          'text-[var(--color-danger)] data-[highlighted]:bg-[var(--color-danger-bg)]',
        className,
      )}
      {...props}
    />
  ),
);
DropdownMenuItem.displayName = 'DropdownMenuItem';
