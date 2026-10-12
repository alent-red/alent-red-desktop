import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(
  ({ className, ...props }, ref): React.ReactElement => (
    <LabelPrimitive.Root
      ref={ref}
      className={mergeClasses(
        'text-[12px] font-medium text-[var(--text-secondary)] tracking-tight',
        className,
      )}
      {...props}
    />
  ),
);

Label.displayName = 'Label';
