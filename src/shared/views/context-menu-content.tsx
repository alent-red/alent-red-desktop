import * as React from 'react';

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(
  ({ className, ...props }, ref): React.ReactElement => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={ref}
        className={mergeClasses(
          'z-[160] min-w-[180px] rounded-[10px]',
          'bg-[var(--bg-surface-raised)] border border-[var(--border-default)]',
          'p-1 shadow-[var(--shadow-lg)]',
          'data-[state=open]:animate-[content-in_120ms_cubic-bezier(0.16,1,0.3,1)]',
          className,
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  ),
);
ContextMenuContent.displayName = 'ContextMenuContent';
