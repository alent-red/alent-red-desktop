import * as React from 'react';

import { computeAvatarBackground } from '@/features/agents/lib/compute-avatar-background';
import { computeAvatarForeground } from '@/features/agents/lib/compute-avatar-foreground';
import { computeInitials } from '@/features/agents/lib/compute-initials';
import type { Agent } from '@/features/agents/types/agent';
import { AgentAvatar } from '@/features/agents/views/agent-avatar';
import { useBlobImage } from '@/features/blob/queries/use-blob-image';
import type { ConversationSender } from '@/features/conversations/types/conversation-sender';
import { GATEWAY_KIND_ICON } from '@/features/gateways/constants/gateway-kind-icon';
import type { Gateway } from '@/features/gateways/types/gateway';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Tooltip } from '@/shared/views/tooltip';

interface ConversationAvatarProps {
  agent: Agent | null;
  sender: ConversationSender;
  gateway: Gateway | null;
  size?: number;
  isSelected?: boolean;
  className?: string;
}

// Diagonal split: top-left favors the agent, bottom-right favors the sender.
// The two halves are clipped with mirrored polygons that share the same edge.
// `SPLIT_TOP_OFFSET_RATIO` controls how far from the top-left corner the
// dividing line emerges; symmetry at the bottom-right keeps the surface 50/50.
const SPLIT_TOP_OFFSET_RATIO = 0.32;
const AGENT_CLIP_POLYGON = `polygon(0% 0%, ${String(
  (1 - SPLIT_TOP_OFFSET_RATIO) * 100,
)}% 0%, ${String(SPLIT_TOP_OFFSET_RATIO * 100)}% 100%, 0% 100%)`;
const SENDER_CLIP_POLYGON = `polygon(${String((1 - SPLIT_TOP_OFFSET_RATIO) * 100)}% 0%, 100% 0%, 100% 100%, ${String(SPLIT_TOP_OFFSET_RATIO * 100)}% 100%)`;

interface SplitImageProps {
  name: string;
  pictureFileKey: string;
  clipPolygon: string;
}

const SplitImage = ({
  name,
  pictureFileKey,
  clipPolygon,
}: SplitImageProps): React.ReactElement | null => {
  const blob = useBlobImage(pictureFileKey);
  if (blob.dataUrl === null) {
    return null;
  }
  return (
    <img
      src={blob.dataUrl}
      alt={name}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ clipPath: clipPolygon, WebkitClipPath: clipPolygon }}
    />
  );
};

interface PlatformBadgeProps {
  gateway: Gateway;
  size: number;
}

const PlatformBadge = ({ gateway, size }: PlatformBadgeProps): React.ReactElement => {
  const PlatformIcon = GATEWAY_KIND_ICON[gateway.config.type];
  // Bumped from 0.4 to 0.46 so the badge can house the icon with breathing room.
  // Icon takes ~52% of the badge instead of ~62%; Lucide paths aren't visually
  // centered in their viewBox (Send is biased upper-right) and a tight fit makes
  // the asymmetry visible.
  const badgeSize = Math.max(16, Math.round(size * 0.46));
  const badgeIconSize = Math.max(9, Math.round(badgeSize * 0.52));
  return (
    <Tooltip content={gateway.name} side="top">
      <span
        className={mergeClasses(
          'absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full',
          'bg-[var(--bg-surface)] text-[var(--text-primary)]',
          'shadow-[var(--shadow-xs)]',
        )}
        style={{ width: `${String(badgeSize)}px`, height: `${String(badgeSize)}px` }}
      >
        <PlatformIcon size={badgeIconSize} strokeWidth={2.1} aria-hidden />
      </span>
    </Tooltip>
  );
};

interface FallbackAvatarProps {
  name: string;
  size: number;
  isSelected: boolean;
}

const FallbackAvatar = ({ name, size, isSelected }: FallbackAvatarProps): React.ReactElement => {
  const dimension = `${String(size)}px`;
  const displayName = name.length > 0 ? name : '?';
  const background = computeAvatarBackground(displayName);
  const foreground = computeAvatarForeground(displayName);
  const initials = computeInitials(displayName);
  return (
    <div
      className={mergeClasses(
        'inline-flex items-center justify-center rounded-full',
        'font-semibold tracking-tight select-none align-middle',
        'transition-all duration-[160ms]',
        isSelected && 'ring-2 ring-[var(--color-brand)] ring-offset-2 ring-offset-[var(--bg-rail)]',
      )}
      style={{
        width: dimension,
        height: dimension,
        backgroundColor: background,
        color: foreground,
        fontSize: `${String(size * 0.4)}px`,
      }}
    >
      <span aria-hidden>{initials}</span>
    </div>
  );
};

interface SenderOnlyAvatarProps {
  sender: ConversationSender;
  size: number;
  isSelected: boolean;
}

const SenderOnlyAvatar = ({
  sender,
  size,
  isSelected,
}: SenderOnlyAvatarProps): React.ReactElement => {
  const name = sender.name ?? sender.userName ?? '?';
  const blob = useBlobImage(sender.pictureFileKey);
  const dimension = `${String(size)}px`;
  if (blob.dataUrl === null) {
    return <FallbackAvatar name={name} size={size} isSelected={isSelected} />;
  }
  return (
    <div
      className={mergeClasses(
        'inline-flex items-center justify-center rounded-full overflow-hidden align-middle',
        'transition-all duration-[160ms]',
        isSelected && 'ring-2 ring-[var(--color-brand)] ring-offset-2 ring-offset-[var(--bg-rail)]',
      )}
      style={{ width: dimension, height: dimension }}
    >
      <img src={blob.dataUrl} alt={name} loading="lazy" className="h-full w-full object-cover" />
    </div>
  );
};

interface SplitAvatarProps {
  agent: Agent;
  agentPictureFileKey: string;
  sender: ConversationSender;
  senderPictureFileKey: string;
  size: number;
  isSelected: boolean;
}

const SplitAvatar = ({
  agent,
  agentPictureFileKey,
  sender,
  senderPictureFileKey,
  size,
  isSelected,
}: SplitAvatarProps): React.ReactElement => {
  const dimension = `${String(size)}px`;
  const senderName = sender.name ?? sender.userName ?? '?';
  return (
    <div
      className={mergeClasses(
        'relative inline-block align-middle shrink-0 rounded-full overflow-hidden',
        'transition-all duration-[160ms]',
        isSelected && 'ring-2 ring-[var(--color-brand)] ring-offset-2 ring-offset-[var(--bg-rail)]',
      )}
      style={{ width: dimension, height: dimension }}
    >
      <SplitImage
        name={agent.name}
        pictureFileKey={agentPictureFileKey}
        clipPolygon={AGENT_CLIP_POLYGON}
      />
      <SplitImage
        name={senderName}
        pictureFileKey={senderPictureFileKey}
        clipPolygon={SENDER_CLIP_POLYGON}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to bottom right, transparent calc(50% - 0.5px), var(--bg-surface) 50%, transparent calc(50% + 0.5px))',
        }}
      />
    </div>
  );
};

interface SplitOrSingleAvatarArgs {
  agent: Agent | null;
  sender: ConversationSender;
  size: number;
  isSelected: boolean;
}

function pickAvatarRendering({
  agent,
  sender,
  size,
  isSelected,
}: SplitOrSingleAvatarArgs): React.ReactElement {
  const agentPicture =
    agent !== null && agent.pictureFileKey !== null && agent.pictureFileKey.length > 0
      ? agent.pictureFileKey
      : null;
  const senderPicture =
    sender.pictureFileKey !== null && sender.pictureFileKey.length > 0
      ? sender.pictureFileKey
      : null;

  if (agent !== null && agentPicture !== null && senderPicture !== null) {
    return (
      <SplitAvatar
        agent={agent}
        agentPictureFileKey={agentPicture}
        sender={sender}
        senderPictureFileKey={senderPicture}
        size={size}
        isSelected={isSelected}
      />
    );
  }
  if (senderPicture !== null && agentPicture === null) {
    return <SenderOnlyAvatar sender={sender} size={size} isSelected={isSelected} />;
  }
  if (agent !== null) {
    return (
      <AgentAvatar
        name={agent.name}
        pictureFileKey={agent.pictureFileKey}
        size={size}
        isSelected={isSelected}
      />
    );
  }
  return (
    <FallbackAvatar name={translate('agents.unassignedName')} size={size} isSelected={isSelected} />
  );
}

export const ConversationAvatar = ({
  agent,
  sender,
  gateway,
  size = 40,
  isSelected = false,
  className,
}: ConversationAvatarProps): React.ReactElement => {
  return (
    <div className={mergeClasses('relative inline-block align-middle shrink-0', className)}>
      {pickAvatarRendering({ agent, sender, size, isSelected })}
      {gateway !== null ? <PlatformBadge gateway={gateway} size={size} /> : null}
    </div>
  );
};
