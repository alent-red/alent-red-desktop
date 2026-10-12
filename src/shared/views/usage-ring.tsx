import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

interface UsageRingProps {
  // 0..1; values above 1 are capped visually.
  ratio: number;
  size?: number;
  className?: string;
}

const USAGE_RING_DEFAULT_SIZE_PX = 18;
const USAGE_RING_STROKE_WIDTH_PX = 2.5;

export const UsageRing = ({
  ratio,
  size = USAGE_RING_DEFAULT_SIZE_PX,
  className,
}: UsageRingProps): React.ReactElement => {
  const radius = (size - USAGE_RING_STROKE_WIDTH_PX) / 2;
  const circumference = 2 * Math.PI * radius;
  const capped = Math.min(1, Math.max(0, ratio));
  const dashOffset = circumference * (1 - capped);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${String(size)} ${String(size)}`}
      aria-hidden
      className={mergeClasses('shrink-0 -rotate-90', className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={USAGE_RING_STROKE_WIDTH_PX}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth={USAGE_RING_STROKE_WIDTH_PX}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        className="transition-[stroke-dashoffset] duration-[320ms]"
      />
    </svg>
  );
};
