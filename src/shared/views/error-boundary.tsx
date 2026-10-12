import * as React from 'react';

import { AlertCircle, RefreshCw } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

interface DefaultErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

const DefaultErrorFallback = ({
  error,
  onReset,
}: DefaultErrorFallbackProps): React.ReactElement => {
  const hasMessage = error.message.length > 0;
  return (
    <div
      role="alert"
      className="relative h-full w-full flex items-center justify-center px-6 py-10"
    >
      <div
        data-tauri-drag-region
        aria-hidden
        className="absolute top-0 left-0 right-0"
        style={{ height: 'var(--titlebar-safe-area)' }}
      />
      <div className="flex flex-col items-center gap-4 max-w-[420px] text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-bg)] text-[var(--color-danger)]">
          <AlertCircle size={22} strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[14px] font-semibold text-primary">
            {translate('common.somethingWentWrong')}
          </div>
          <div className="text-[12.5px] text-muted leading-relaxed">
            {translate('common.unexpectedErrorBody')}
          </div>
        </div>
        {hasMessage ? (
          <div className="text-[11px] text-muted font-mono break-all max-h-[100px] overflow-auto bg-panel border border-default rounded-[8px] px-2 py-1.5 w-full">
            {error.message}
          </div>
        ) : null}
        <Button variant="primary" size="sm" onClick={onReset} className="mt-1">
          <RefreshCw size={13} strokeWidth={2.1} />
          {translate('common.tryAgain')}
        </Button>
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  override render(): React.ReactNode {
    if (this.state.error === null) {
      return this.props.children;
    }
    if (this.props.fallback !== undefined) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return <DefaultErrorFallback error={this.state.error} onReset={this.reset} />;
  }
}
