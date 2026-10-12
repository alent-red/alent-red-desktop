import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator = ({
  orientation = 'horizontal',
  className,
}: SeparatorProps): React.ReactElement => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={mergeClasses(
        'bg-[var(--border-subtle)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className,
      )}
    />
  );
};
