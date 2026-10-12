import * as React from 'react';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>): React.ReactElement => {
  return (
    <DropdownMenuPrimitive.Separator
      className={mergeClasses('my-1 h-px bg-[var(--border-subtle)]', className)}
      {...props}
    />
  );
};
