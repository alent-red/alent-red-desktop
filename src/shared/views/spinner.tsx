import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

interface SpinnerProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
  label?: string;
}

const SPINNER_DEFAULT_SIZE_PX = 16;
const SPINNER_DEFAULT_STROKE_WIDTH = 2;

export const Spinner = ({
  size = SPINNER_DEFAULT_SIZE_PX,
  className,
  strokeWidth = SPINNER_DEFAULT_STROKE_WIDTH,
  label,
}: SpinnerProps): React.ReactElement => {
  const hasLabel = label !== undefined && label.length > 0;
  return (
    <span
      role={hasLabel ? 'status' : undefined}
      aria-label={label}
      className={mergeClasses('inline-flex items-center justify-center', className)}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[spin_900ms_linear_infinite]"
      >
        <circle
          cx="12"
          cy="12"
          r={10}
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth={strokeWidth}
        />
        <path
          d="M22 12C22 6.477 17.523 2 12 2"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};
