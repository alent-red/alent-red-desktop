import * as React from 'react';

import { listen } from '@tauri-apps/api/event';

import { registerTransportFailureReporter } from '@/features/transport/actions/register-transport-failure-reporter';
import { infoApi } from '@/features/transport/apis/info-api';
import {
  useTransportStore,
  type TransportMarkFailed,
} from '@/features/transport/stores/transport-store';
import { TransportPhase } from '@/features/transport/types/transport-phase';
import { ConversationEventNames } from '@/shared/events/conversation-event-names';
import { MessageEventNames } from '@/shared/events/message-event-names';
import { translate } from '@/shared/i18n/translate';
import type { AppErrorPayload } from '@/shared/types/app-error-payload';

const HEARTBEAT_INTERVAL_MS = 10_000;

registerTransportFailureReporter();

export function useTransportHealth(): void {
  const phase = useTransportStore((state): TransportPhase => state.phase);
  const markFailed = useTransportStore((state): TransportMarkFailed => state.markFailed);

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const isAborted = (): boolean => signal.aborted;
    const unsubscribers: (() => void)[] = [];

    const subscribeStreamError = async (eventName: string): Promise<void> => {
      try {
        const unlisten = await listen<AppErrorPayload>(eventName, (envelope): void => {
          markFailed(envelope.payload.message ?? translate('transport.streamError', { eventName }));
        });
        if (isAborted()) {
          unlisten();
          return;
        }
        unsubscribers.push(unlisten);
      } catch (caught) {
        markFailed(
          caught instanceof Error
            ? translate('transport.subscribeFailedWithMessage', {
                eventName,
                message: caught.message,
              })
            : translate('transport.subscribeFailed', { eventName }),
        );
      }
    };

    void subscribeStreamError(ConversationEventNames.StreamError);
    void subscribeStreamError(MessageEventNames.StreamError);

    return (): void => {
      abortController.abort();
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
    };
  }, [markFailed]);

  React.useEffect((): (() => void) | undefined => {
    if (phase !== TransportPhase.Connected) {
      return undefined;
    }
    const intervalId = window.setInterval((): void => {
      void infoApi.get().catch((): void => undefined);
    }, HEARTBEAT_INTERVAL_MS);
    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [phase]);
}
