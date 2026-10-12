import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  return (
    <div
      className={mergeClasses('flex flex-col gap-1 px-5 pt-5 pb-2 shrink-0', className)}
      {...props}
    />
  );
};
