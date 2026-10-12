import * as React from 'react';

import { LoadingState } from '@/shared/views/loading-state';
import { QueryErrorState } from '@/shared/views/query-error-state';

export interface BootstrapQuery {
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => unknown;
}

interface FormBootstrapProps {
  queries: readonly BootstrapQuery[];
  children: React.ReactNode;
  loadingClassName?: string;
}

// Must be >= the dialog open animation duration (`content-in` 180ms),
// so the swap from loading to form happens after the dialog finishes opening.
const FORM_BOOTSTRAP_MIN_LOADING_MS = 200;

export const FormBootstrap = ({
  queries,
  children,
  loadingClassName,
}: FormBootstrapProps): React.ReactElement => {
  const hasQueries = queries.length > 0;

  const [hasReadyOnce, setHasReadyOnce] = React.useState(!hasQueries);
  const [hasMinDelayElapsed, setHasMinDelayElapsed] = React.useState(!hasQueries);

  React.useEffect((): (() => void) | undefined => {
    if (!hasQueries) {
      return undefined;
    }
    const timer = window.setTimeout((): void => {
      setHasMinDelayElapsed(true);
    }, FORM_BOOTSTRAP_MIN_LOADING_MS);
    return (): void => {
      window.clearTimeout(timer);
    };
  }, [hasQueries]);

  const hasAnyError = queries.some((query): boolean => query.isError);
  const isAllSettled = queries.every((query): boolean => !query.isFetching && !query.isError);

  if (!hasReadyOnce && isAllSettled && hasMinDelayElapsed) {
    setHasReadyOnce(true);
  }

  if (hasReadyOnce) {
    return <>{children}</>;
  }

  if (hasAnyError) {
    const failed = queries.find((query): boolean => query.isError);
    return (
      <QueryErrorState
        error={failed?.error}
        onRetry={(): void => {
          for (const query of queries) {
            if (query.isError) {
              query.refetch();
            }
          }
        }}
      />
    );
  }

  return loadingClassName !== undefined ? (
    <LoadingState className={loadingClassName} />
  ) : (
    <LoadingState />
  );
};
