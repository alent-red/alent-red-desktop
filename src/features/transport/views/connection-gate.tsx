import * as React from 'react';

import { useTransportStore } from '@/features/transport/stores/transport-store';
import { TransportPhase } from '@/features/transport/types/transport-phase';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Logo } from '@/shared/views/logo';
import { Spinner } from '@/shared/views/spinner';

interface ConnectionGateProps {
  children: React.ReactNode;
}

const SPINNER_REVEAL_DELAY_MS = 800;

export const ConnectionGate = ({ children }: ConnectionGateProps): React.ReactElement => {
  const phase = useTransportStore((state): TransportPhase => state.phase);
  const lastError = useTransportStore((state): string | null => state.lastError);
  const connect = useTransportStore((state): (() => Promise<void>) => state.connect);

  const isWaiting = phase === TransportPhase.Connecting || phase === TransportPhase.Idle;
  const [isLoadingVisible, setIsLoadingVisible] = React.useState(false);
  const [previousIsWaiting, setPreviousIsWaiting] = React.useState(isWaiting);
  if (isWaiting !== previousIsWaiting) {
    setPreviousIsWaiting(isWaiting);
    if (!isWaiting) {
      setIsLoadingVisible(false);
    }
  }

  React.useEffect((): (() => void) | undefined => {
    if (!isWaiting) {
      return undefined;
    }
    const timer = window.setTimeout((): void => {
      setIsLoadingVisible(true);
    }, SPINNER_REVEAL_DELAY_MS);
    return (): void => {
      window.clearTimeout(timer);
    };
  }, [isWaiting]);

  if (phase === TransportPhase.Connected) {
    return <>{children}</>;
  }

  const isFailed = phase === TransportPhase.Failed;
  const hasLastError = lastError !== null && lastError.length > 0;

  let content: React.ReactNode = null;
  if (isFailed) {
    content = (
      <div className="flex flex-col items-center gap-4 max-w-[360px] text-center px-6">
        <Logo size={48} />
        <div className="text-[14px] text-primary font-medium">{translate('transport.failed')}</div>
        {hasLastError ? (
          <div className="text-[11px] text-muted font-mono break-all max-h-[100px] overflow-auto bg-panel border border-default rounded-[8px] px-2 py-1.5">
            {lastError}
          </div>
        ) : null}
        <Button
          variant="primary"
          size="sm"
          onClick={(): void => {
            void connect();
          }}
        >
          {translate('transport.retry')}
        </Button>
      </div>
    );
  } else if (isWaiting && isLoadingVisible) {
    content = (
      <div className="flex flex-col items-center gap-4 max-w-[360px] text-center px-6 animate-[fade-in_200ms_cubic-bezier(0.16,1,0.3,1)]">
        <Logo size={48} />
        <Spinner size={20} className="text-[var(--text-secondary)]" />
        <div className="text-[13px] text-secondary">{translate('transport.connecting')}</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-app">
      <div
        data-tauri-drag-region
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{ height: 'var(--titlebar-safe-area)' }}
      />
      {content}
    </div>
  );
};
