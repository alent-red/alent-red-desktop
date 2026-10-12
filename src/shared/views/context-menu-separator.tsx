import * as React from 'react';

import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const ContextMenuSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>): React.ReactElement => {
  return (
    <ContextMenuPrimitive.Separator
      className={mergeClasses('my-1 h-px bg-[var(--border-subtle)]', className)}
      {...props}
    />
  );
};
