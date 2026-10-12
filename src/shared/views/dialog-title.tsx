import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DialogTitle = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>): React.ReactElement => {
  return (
    <DialogPrimitive.Title
      className={mergeClasses(
        'text-[15px] font-semibold tracking-tight text-[var(--text-primary)]',
        className,
      )}
      {...props}
    />
  );
};
