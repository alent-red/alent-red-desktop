import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement => {
  return (
    <div
      className={mergeClasses(
        'flex flex-row items-center justify-between gap-2 px-5 pt-3 pb-4 border-t border-[var(--border-subtle)] shrink-0',
        className,
      )}
      {...props}
    />
  );
};
