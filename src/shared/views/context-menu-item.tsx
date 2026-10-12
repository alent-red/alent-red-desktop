import * as React from 'react';

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

import { mergeClasses } from '@/shared/lib/merge-classes';

interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> {
  variant?: 'default' | 'danger';
}

export const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(
  ({ className, variant = 'default', ...props }, ref): React.ReactElement => (
    <ContextMenuPrimitive.Item
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
ContextMenuItem.displayName = 'ContextMenuItem';
