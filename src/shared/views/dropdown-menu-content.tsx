import * as React from 'react';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(
  ({ className, sideOffset = 6, align = 'end', ...props }, ref): React.ReactElement => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        className={mergeClasses(
          'z-[160] min-w-[180px] rounded-[10px]',
          'bg-[var(--bg-surface-raised)] border border-[var(--border-default)]',
          'p-1 shadow-[var(--shadow-lg)]',
          'data-[state=open]:animate-[content-in_120ms_cubic-bezier(0.16,1,0.3,1)]',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);
DropdownMenuContent.displayName = 'DropdownMenuContent';
