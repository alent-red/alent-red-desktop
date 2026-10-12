import * as React from 'react';

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

import { mergeClasses } from '@/shared/lib/merge-classes';

const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(
  ({ className, orientation = 'vertical', ...props }, ref): React.ReactElement => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={mergeClasses(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' && 'h-full w-2.5 p-0.5',
        orientation === 'horizontal' && 'h-2.5 flex-col p-0.5',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[var(--border-default)] hover:bg-[var(--border-strong)] transition-colors" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  ),
);
ScrollBar.displayName = 'ScrollBar';

export const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(
  ({ className, children, ...props }, ref): React.ReactElement => (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={mergeClasses('relative overflow-hidden', className)}
      {...props}
    >
      {/* Radix wraps children in a `display: table` div that sizes to content,
          which defeats text truncation inside; force it to behave as a block. */}
      <ScrollAreaPrimitive.Viewport className="h-full w-full [&>div]:!block [&>div]:min-w-0">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  ),
);
ScrollArea.displayName = 'ScrollArea';
