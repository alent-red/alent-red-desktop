import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(
  ({ className, sideOffset = 8, side = 'right', ...props }, ref): React.ReactElement => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        side={side}
        sideOffset={sideOffset}
        className={mergeClasses(
          'z-[200] rounded-[6px] bg-[var(--text-primary)] text-[var(--text-inverse)]',
          'px-2 py-1 text-[11.5px] font-medium tracking-tight',
          'shadow-[var(--shadow-md)]',
          'data-[state=delayed-open]:animate-[fade-in_140ms_cubic-bezier(0.16,1,0.3,1)]',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  ),
);
TooltipContent.displayName = 'TooltipContent';
