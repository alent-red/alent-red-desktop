import * as React from 'react';

import { LoadingState } from '@/shared/views/loading-state';
import { QueryErrorState } from '@/shared/views/query-error-state';
import { ScrollArea } from '@/shared/views/scroll-area';

interface SectionBodyProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

export const SectionBody = ({
  isLoading,
  isError,
  error,
  isFetching,
  onRetry,
  children,
}: SectionBodyProps): React.ReactElement => {
  if (isLoading) {
    return <LoadingState />;
  }
  if (isError) {
    return <QueryErrorState error={error} onRetry={onRetry} isRetrying={isFetching} />;
  }
  return (
    <ScrollArea className="flex-1">
      <div className="px-6 py-4">{children}</div>
    </ScrollArea>
  );
};
