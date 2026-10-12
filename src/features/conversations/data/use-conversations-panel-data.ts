import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { listen } from '@tauri-apps/api/event';

import { conversationsApi } from '@/features/conversations/apis/conversations-api';
import type { BufferedConversationEvent } from '@/features/conversations/data/buffered-conversation-event';
import { BufferedConversationEventType } from '@/features/conversations/data/buffered-conversation-event-type';
import { ConversationsPanelPhase } from '@/features/conversations/data/conversations-panel-phase';
import { conversationQueryKeys } from '@/features/conversations/queries/conversation-query-keys';
import type { Conversation } from '@/features/conversations/types/conversation';
import { toastError } from '@/features/toasts/actions/toast-error';
import { ConversationEventNames } from '@/shared/events/conversation-event-names';
import { assertNever } from '@/shared/lib/assert-never';

interface UseConversationsPanelDataResult {
  list: Conversation[];
  phase: ConversationsPanelPhase;
  error: unknown;
  retry: () => void;
}

function compareUpdatedDesc(left: Conversation, right: Conversation): number {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function applySave(previous: Conversation[], next: Conversation): Conversation[] {
  const filtered = previous.filter((entry): boolean => entry.id !== next.id);
  const insertAt = filtered.findIndex((entry): boolean => compareUpdatedDesc(next, entry) <= 0);
  if (insertAt === -1) {
    filtered.push(next);
  } else {
    filtered.splice(insertAt, 0, next);
  }
  return filtered;
}

function applyDelete(previous: Conversation[], id: string): Conversation[] {
  const next = previous.filter((entry): boolean => entry.id !== id);
  return next.length === previous.length ? previous : next;
}

function applyBufferedEvents(
  base: Conversation[],
  events: BufferedConversationEvent[],
): Conversation[] {
  let next = base;
  for (const event of events) {
    switch (event.type) {
      case BufferedConversationEventType.Save:
        next = applySave(next, event.conversation);
        break;
      case BufferedConversationEventType.Delete:
        next = applyDelete(next, event.id);
        break;
      default:
        assertNever(event);
    }
  }
  return next;
}

export function useConversationsPanelData(): UseConversationsPanelDataResult {
  const queryClient = useQueryClient();

  const [list, setList] = React.useState<Conversation[]>((): Conversation[] => {
    const cached = queryClient.getQueryData<Conversation[]>(conversationQueryKeys.list(null));
    return cached ?? [];
  });

  const [phase, setPhase] = React.useState<ConversationsPanelPhase>((): ConversationsPanelPhase => {
    const cached = queryClient.getQueryData<Conversation[]>(conversationQueryKeys.list(null));
    return cached !== undefined
      ? ConversationsPanelPhase.WarmLoading
      : ConversationsPanelPhase.ColdLoading;
  });

  const [error, setError] = React.useState<unknown>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  const phaseRef = React.useRef(phase);
  const bufferRef = React.useRef<BufferedConversationEvent[]>([]);
  const listRef = React.useRef(list);

  React.useEffect((): void => {
    phaseRef.current = phase;
  }, [phase]);

  React.useEffect((): void => {
    listRef.current = list;
  }, [list]);

  const updateList = React.useCallback(
    (next: Conversation[]): void => {
      setList(next);
      listRef.current = next;
      queryClient.setQueryData<Conversation[]>(conversationQueryKeys.list(null), next);
    },
    [queryClient],
  );

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const isAborted = (): boolean => signal.aborted;
    let savesStreamKey: string | null = null;
    let deletionsStreamKey: string | null = null;
    const unlisteners: (() => void)[] = [];

    const handleSaveEvent = (conversation: Conversation): void => {
      if (phaseRef.current === ConversationsPanelPhase.Ready) {
        updateList(applySave(listRef.current, conversation));
        return;
      }
      bufferRef.current.push({ type: BufferedConversationEventType.Save, conversation });
    };

    const handleDeleteEvent = (id: string): void => {
      if (phaseRef.current === ConversationsPanelPhase.Ready) {
        updateList(applyDelete(listRef.current, id));
        return;
      }
      bufferRef.current.push({ type: BufferedConversationEventType.Delete, id });
    };

    const bootstrap = async (): Promise<void> => {
      try {
        const unlistenSaved = await listen<Conversation>(
          ConversationEventNames.Saved,
          (envelope): void => {
            handleSaveEvent(envelope.payload);
          },
        );
        if (isAborted()) {
          unlistenSaved();
          return;
        }
        unlisteners.push(unlistenSaved);

        const unlistenDeleted = await listen<string>(
          ConversationEventNames.Deleted,
          (envelope): void => {
            handleDeleteEvent(envelope.payload);
          },
        );
        if (isAborted()) {
          unlistenDeleted();
          return;
        }
        unlisteners.push(unlistenDeleted);

        savesStreamKey = await conversationsApi.watchSavesStart(null);
        if (isAborted()) {
          return;
        }

        deletionsStreamKey = await conversationsApi.watchDeletionsStart();
        if (isAborted()) {
          return;
        }

        const fresh = await conversationsApi.getAll(null);
        if (isAborted()) {
          return;
        }

        const drained = applyBufferedEvents(fresh, bufferRef.current);
        bufferRef.current = [];
        updateList(drained);
        setPhase(ConversationsPanelPhase.Ready);
      } catch (caught) {
        if (isAborted()) {
          return;
        }
        setError(caught);
        setPhase(ConversationsPanelPhase.Error);
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
        conversationsApi.watchSavesStop(savesStreamKey).catch((caught: unknown): void => {
          toastError(caught);
        });
      }
      if (deletionsStreamKey !== null) {
        conversationsApi.watchDeletionsStop(deletionsStreamKey).catch((caught: unknown): void => {
          toastError(caught);
        });
      }
    };
  }, [reloadKey, updateList]);

  const retry = React.useCallback((): void => {
    setError(null);
    setPhase(ConversationsPanelPhase.ColdLoading);
    bufferRef.current = [];
    setReloadKey((key): number => key + 1);
  }, []);

  return { list, phase, error, retry };
}
