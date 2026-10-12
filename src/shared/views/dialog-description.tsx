import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DialogDescription = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>): React.ReactElement => {
  return (
    <DialogPrimitive.Description
      className={mergeClasses(
        'text-[13px] text-[var(--text-secondary)] leading-relaxed',
        className,
      )}
      {...props}
    />
  );
};
