import * as React from 'react';

import { runUpdateCheck } from '@/features/about/actions/run-update-check';

const POLL_INTERVAL_MS = 10 * 60 * 1000;

export function useUpdateWatcher(): void {
  React.useEffect((): (() => void) => {
    void runUpdateCheck();

    const intervalId = setInterval((): void => {
      void runUpdateCheck();
    }, POLL_INTERVAL_MS);

    return (): void => {
      clearInterval(intervalId);
    };
  }, []);
}
