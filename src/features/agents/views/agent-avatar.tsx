import * as React from 'react';

import { computeAvatarBackground } from '@/features/agents/lib/compute-avatar-background';
import { computeAvatarForeground } from '@/features/agents/lib/compute-avatar-foreground';
import { computeInitials } from '@/features/agents/lib/compute-initials';
import { useBlobImage } from '@/features/blob/queries/use-blob-image';
import { mergeClasses } from '@/shared/lib/merge-classes';

interface AgentAvatarProps {
  name: string;
  pictureFileKey: string | null;
  pictureDataUrl?: string | null;
  size?: number;
  isSelected?: boolean;
  className?: string;
}

export const AgentAvatar = ({
  name,
  pictureFileKey,
  pictureDataUrl,
  size = 40,
  isSelected = false,
  className,
}: AgentAvatarProps): React.ReactElement => {
  const dimension = `${String(size)}px`;
  const displayName = name.length > 0 ? name : '?';
  const background = computeAvatarBackground(displayName);
  const foreground = computeAvatarForeground(displayName);
  const initials = computeInitials(displayName);
  const hasInlineDataUrl = pictureDataUrl !== null && pictureDataUrl !== undefined;
  const blobImage = useBlobImage(hasInlineDataUrl ? null : pictureFileKey);
  const resolvedDataUrl = pictureDataUrl ?? blobImage.dataUrl;
  const hasResolvedDataUrl = resolvedDataUrl !== null;

  return (
    <div
      className={mergeClasses(
        'inline-flex items-center justify-center rounded-full overflow-hidden align-middle',
        'font-semibold tracking-tight select-none',
        'transition-all duration-[160ms]',
        isSelected && 'ring-2 ring-[var(--color-brand)] ring-offset-2 ring-offset-[var(--bg-rail)]',
        className,
      )}
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: hasResolvedDataUrl ? undefined : background,
        color: hasResolvedDataUrl ? undefined : foreground,
        fontSize: `${String(size * 0.4)}px`,
      }}
    >
      {hasResolvedDataUrl ? (
        <img
          src={resolvedDataUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </div>
  );
};
