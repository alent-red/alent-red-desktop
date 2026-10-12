import * as React from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const SelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  ({ className, position = 'popper', ...props }, ref): React.ReactElement => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        position={position}
        className={mergeClasses(
          'z-[170] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-[10px]',
          'bg-[var(--bg-surface-raised)] border border-[var(--border-default)]',
          'shadow-[var(--shadow-lg)]',
          'data-[state=open]:animate-[content-in_140ms_cubic-bezier(0.16,1,0.3,1)]',
          className,
        )}
        sideOffset={6}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-1 max-h-[280px]">
          {props.children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
);
SelectContent.displayName = 'SelectContent';
