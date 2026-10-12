import * as React from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { presentError } from '@/shared/lib/present-error';
import { Button } from '@/shared/views/button';
import { Spinner } from '@/shared/views/spinner';

interface QueryErrorStateProps {
  error: unknown;
  onRetry: () => void | Promise<void>;
  isRetrying?: boolean;
  className?: string;
}

export const QueryErrorState = ({
  error,
  onRetry,
  isRetrying = false,
  className,
}: QueryErrorStateProps): React.ReactElement => {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const presented = presentError(error);
  const hasDetail = presented.detail !== null && presented.detail.length > 0;

  return (
    <div
      role="alert"
      className={mergeClasses(
        'h-full w-full flex flex-col items-center justify-center gap-3 px-6 py-10 text-center',
        className,
      )}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-bg)] text-[var(--color-danger)]">
        <AlertCircle size={22} strokeWidth={2} />
      </div>
      <div className="flex flex-col items-center gap-1 max-w-[360px]">
        <div className="text-[14px] font-semibold text-primary">{presented.title}</div>
        {hasDetail && isDetailsOpen ? (
          <div className="mt-1 w-full text-[11.5px] text-muted font-mono leading-snug whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto bg-panel border border-default rounded-[8px] px-2 py-1.5 text-left">
            {presented.detail}
          </div>
        ) : null}
        {hasDetail ? (
          <button
            type="button"
            onClick={(): void => {
              setIsDetailsOpen((value): boolean => !value);
            }}
            className="mt-0.5 text-[11.5px] font-medium text-muted hover:text-primary underline-offset-2 hover:underline"
          >
            {isDetailsOpen ? translate('common.hideDetails') : translate('common.showDetails')}
          </button>
        ) : null}
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={(): void => {
          void onRetry();
        }}
        disabled={isRetrying}
      >
        {isRetrying ? (
          <Spinner size={13} className="text-current" />
        ) : (
          <RefreshCw size={13} strokeWidth={2.1} />
        )}
        {translate('common.retry')}
      </Button>
    </div>
  );
};
