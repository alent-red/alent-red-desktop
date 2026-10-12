import * as React from 'react';

import { RefreshCw } from 'lucide-react';

import { presentError } from '@/shared/lib/present-error';
import { Spinner } from '@/shared/views/spinner';
import { Tooltip } from '@/shared/views/tooltip';

interface AgentRailErrorIndicatorProps {
  error: unknown;
  isRetrying: boolean;
  onRetry: () => void;
}

export const AgentRailErrorIndicator = ({
  error,
  isRetrying,
  onRetry,
}: AgentRailErrorIndicatorProps): React.ReactElement => {
  const presented = presentError(error);
  return (
    <Tooltip content={presented.title}>
      <button
        type="button"
        aria-label={presented.title}
        onClick={onRetry}
        disabled={isRetrying}
        className={[
          'inline-flex h-10 w-10 items-center justify-center rounded-full',
          'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
          'transition-colors duration-[140ms]',
          'hover:bg-[var(--color-danger)] hover:text-[var(--color-brand-foreground)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-rail)]',
          'disabled:opacity-60 disabled:cursor-not-allowed',
        ].join(' ')}
      >
        {isRetrying ? (
          <Spinner size={14} className="text-current" />
        ) : (
          <RefreshCw size={15} strokeWidth={2.1} />
        )}
      </button>
    </Tooltip>
  );
};
