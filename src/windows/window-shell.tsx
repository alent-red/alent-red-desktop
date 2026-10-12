import * as React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { listen } from '@tauri-apps/api/event';

import { applyUpdateFoundBroadcast } from '@/features/about/actions/apply-update-found-broadcast';
import { UPDATE_FOUND_EVENT } from '@/features/about/events/update-found-event';
import type { UpdateInfo } from '@/features/about/types/update-info';
import { applyExternalThemeBroadcast } from '@/features/theme/actions/apply-external-theme-broadcast';
import { THEME_CHANGED_EVENT } from '@/features/theme/events/theme-changed-event';
import { useThemeStore, type ThemeState } from '@/features/theme/stores/theme-store';
import type { ThemeMode } from '@/features/theme/types/theme-mode';
import { toastError } from '@/features/toasts/actions/toast-error';
import { ToastViewport } from '@/features/toasts/views/toast-viewport';
import { connectTransport } from '@/features/transport/actions/connect-transport';
import { useTransportHealth } from '@/features/transport/queries/use-transport-health';
import { ConnectionGate } from '@/features/transport/views/connection-gate';
import { applyExternalWindowBehaviorBroadcast } from '@/features/window-behavior/actions/apply-external-window-behavior-broadcast';
import { WINDOW_BEHAVIOR_CHANGED_EVENT } from '@/features/window-behavior/events/window-behavior-changed-event';
import { useWindowBehaviorApplier } from '@/features/window-behavior/queries/use-window-behavior-applier';
import type { WindowBehavior } from '@/features/window-behavior/types/window-behavior';
import { ErrorBoundary } from '@/shared/views/error-boundary';

interface WindowShellProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
});

const WindowBootstrap = ({ children }: WindowShellProps): React.ReactElement => {
  const currentThemeMode = useThemeStore((state: ThemeState): ThemeState['mode'] => state.mode);

  useTransportHealth();
  useWindowBehaviorApplier();

  React.useEffect((): void => {
    void connectTransport();
  }, []);

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    let unlisten: (() => void) | null = null;

    listen<ThemeMode>(THEME_CHANGED_EVENT, (envelope): void => {
      if (envelope.payload === currentThemeMode) {
        return;
      }
      applyExternalThemeBroadcast(envelope.payload);
    })
      .then((unlistener): void => {
        if (abortController.signal.aborted) {
          unlistener();
          return;
        }
        unlisten = unlistener;
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });

    return (): void => {
      abortController.abort();
      if (unlisten !== null) {
        unlisten();
      }
    };
  }, [currentThemeMode]);

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    let unlisten: (() => void) | null = null;

    listen<UpdateInfo>(UPDATE_FOUND_EVENT, (envelope): void => {
      applyUpdateFoundBroadcast(envelope.payload);
    })
      .then((unlistener): void => {
        if (abortController.signal.aborted) {
          unlistener();
          return;
        }
        unlisten = unlistener;
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });

    return (): void => {
      abortController.abort();
      if (unlisten !== null) {
        unlisten();
      }
    };
  }, []);

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    let unlisten: (() => void) | null = null;

    listen<WindowBehavior>(WINDOW_BEHAVIOR_CHANGED_EVENT, (envelope): void => {
      applyExternalWindowBehaviorBroadcast(envelope.payload);
    })
      .then((unlistener): void => {
        if (abortController.signal.aborted) {
          unlistener();
          return;
        }
        unlisten = unlistener;
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });

    return (): void => {
      abortController.abort();
      if (unlisten !== null) {
        unlisten();
      }
    };
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-app text-primary">
      <ConnectionGate>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ConnectionGate>
      <ToastViewport />
    </div>
  );
};

export const WindowShell = ({ children }: WindowShellProps): React.ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <WindowBootstrap>{children}</WindowBootstrap>
    </QueryClientProvider>
  );
};
