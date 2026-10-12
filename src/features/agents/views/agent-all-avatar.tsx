import * as React from 'react';

import { LayoutGrid } from 'lucide-react';

import { mergeClasses } from '@/shared/lib/merge-classes';

interface AgentAllAvatarProps {
  size?: number;
  isSelected?: boolean;
  className?: string;
}

export const AgentAllAvatar = ({
  size = 40,
  isSelected = false,
  className,
}: AgentAllAvatarProps): React.ReactElement => {
  const dimension = `${String(size)}px`;
  return (
    <div
      className={mergeClasses(
        'inline-flex items-center justify-center rounded-full',
        'bg-[var(--bg-active)] text-[var(--text-secondary)]',
        'transition-all duration-[160ms]',
        isSelected &&
          'ring-2 ring-[var(--color-brand)] ring-offset-2 ring-offset-[var(--bg-rail)] text-[var(--text-primary)]',
        className,
      )}
      style={{ width: dimension, height: dimension }}
    >
      <LayoutGrid size={size * 0.45} strokeWidth={2.1} aria-hidden />
    </div>
  );
};
