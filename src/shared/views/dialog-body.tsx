import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  return (
    <div
      className={mergeClasses('flex-1 min-h-0 overflow-y-auto px-5 py-2', className)}
      {...props}
    />
  );
};
