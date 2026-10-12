import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { listen } from '@tauri-apps/api/event';

import { messagesApi } from '@/features/messages/apis/messages-api';
import type { BufferedMessageEvent } from '@/features/messages/data/buffered-message-event';
import { BufferedMessageEventType } from '@/features/messages/data/buffered-message-event-type';
import { MessagesPanelPhase } from '@/features/messages/data/messages-panel-phase';
import { messageQueryKeys } from '@/features/messages/queries/message-query-keys';
import type { Message } from '@/features/messages/types/message';
import { toastError } from '@/features/toasts/actions/toast-error';
import { MessageEventNames } from '@/shared/events/message-event-names';
import { assertNever } from '@/shared/lib/assert-never';

interface UseMessagesPanelDataResult {
  list: Message[];
  phase: MessagesPanelPhase;
  error: unknown;
  retry: () => void;
}

function applySave(previous: Message[], next: Message): Message[] {
  for (let index = previous.length - 1; index >= 0; index -= 1) {
    const current = previous[index];
    if (current?.id === next.id) {
      const copy = [...previous];
      copy[index] = next;
      return copy;
    }
  }
  return [...previous, next];
}

function applyDeleteAfter(previous: Message[], anchorId: string): Message[] {
  const anchorIndex = previous.findIndex((entry): boolean => entry.id === anchorId);
  if (anchorIndex === -1) {
    return previous;
  }
  return previous.slice(0, anchorIndex + 1);
}

function applyBufferedEvents(base: Message[], events: BufferedMessageEvent[]): Message[] {
  let next = base;
  for (const event of events) {
    switch (event.type) {
      case BufferedMessageEventType.Save:
        next = applySave(next, event.message);
        break;
      case BufferedMessageEventType.DeleteAfter:
        next = applyDeleteAfter(next, event.anchorId);
        break;
      default:
        assertNever(event);
    }
  }
  return next;
}

export function useMessagesPanelData(conversationId: string): UseMessagesPanelDataResult {
  const queryClient = useQueryClient();

  const [list, setList] = React.useState<Message[]>((): Message[] => {
    const cached = queryClient.getQueryData<Message[]>(messageQueryKeys.list(conversationId));
    return cached ?? [];
  });

  const [phase, setPhase] = React.useState<MessagesPanelPhase>((): MessagesPanelPhase => {
    const cached = queryClient.getQueryData<Message[]>(messageQueryKeys.list(conversationId));
    return cached !== undefined ? MessagesPanelPhase.WarmLoading : MessagesPanelPhase.ColdLoading;
  });

  const [error, setError] = React.useState<unknown>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  const phaseRef = React.useRef(phase);
  const bufferRef = React.useRef<BufferedMessageEvent[]>([]);
  const listRef = React.useRef(list);

  React.useEffect((): void => {
    phaseRef.current = phase;
  }, [phase]);

  React.useEffect((): void => {
    listRef.current = list;
  }, [list]);

  const updateList = React.useCallback(
    (next: Message[]): void => {
      setList(next);
      listRef.current = next;
      queryClient.setQueryData<Message[]>(messageQueryKeys.list(conversationId), next);
    },
    [queryClient, conversationId],
  );

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const isAborted = (): boolean => signal.aborted;
    let savesStreamKey: string | null = null;
    let deleteAftersStreamKey: string | null = null;
    const unlisteners: (() => void)[] = [];

    const handleSaveEvent = (incoming: Message): void => {
      if (incoming.conversationId !== conversationId) {
        return;
      }
      if (phaseRef.current === MessagesPanelPhase.Ready) {
        updateList(applySave(listRef.current, incoming));
        return;
      }
      bufferRef.current.push({ type: BufferedMessageEventType.Save, message: incoming });
    };

    const handleDeleteAfterEvent = (anchorId: string): void => {
      if (phaseRef.current === MessagesPanelPhase.Ready) {
        updateList(applyDeleteAfter(listRef.current, anchorId));
        return;
      }
      bufferRef.current.push({ type: BufferedMessageEventType.DeleteAfter, anchorId });
    };

    const bootstrap = async (): Promise<void> => {
      try {
        const unlistenSaved = await listen<Message>(MessageEventNames.Saved, (envelope): void => {
          handleSaveEvent(envelope.payload);
        });
        if (isAborted()) {
          unlistenSaved();
          return;
        }
        unlisteners.push(unlistenSaved);

        const unlistenDeletedAfter = await listen<string>(
          MessageEventNames.DeletedAfter,
          (envelope): void => {
            handleDeleteAfterEvent(envelope.payload);
          },
        );
        if (isAborted()) {
          unlistenDeletedAfter();
          return;
        }
        unlisteners.push(unlistenDeletedAfter);

        savesStreamKey = await messagesApi.watchSavesStart(conversationId);
        if (isAborted()) {
          return;
        }

        deleteAftersStreamKey = await messagesApi.watchDeleteAftersStart(conversationId);
        if (isAborted()) {
          return;
        }

        const fresh = await messagesApi.getAll({
          conversationId,
          beforeMessageId: null,
          count: null,
        });
        if (isAborted()) {
          return;
        }

        const drained = applyBufferedEvents(fresh, bufferRef.current);
        bufferRef.current = [];
        updateList(drained);
        setPhase(MessagesPanelPhase.Ready);
      } catch (caught) {
        if (isAborted()) {
          return;
        }
        setError(caught);
        setPhase(MessagesPanelPhase.Error);
      }
    };

    void bootstrap();

    return (): void => {
      abortController.abort();
      for (const unlisten of unlisteners) {
        unlisten();
      }
      bufferRef.current = [];
      if (savesStreamKey !== null) {
        messagesApi.watchSavesStop(savesStreamKey).catch((caught: unknown): void => {
          toastError(caught);
        });
      }
      if (deleteAftersStreamKey !== null) {
        messagesApi.watchDeleteAftersStop(deleteAftersStreamKey).catch((caught: unknown): void => {
          toastError(caught);
        });
      }
    };
  }, [conversationId, reloadKey, updateList]);

  const retry = React.useCallback((): void => {
    setError(null);
    setPhase(MessagesPanelPhase.ColdLoading);
    bufferRef.current = [];
    setReloadKey((key): number => key + 1);
  }, []);

  return { list, phase, error, retry };
}
