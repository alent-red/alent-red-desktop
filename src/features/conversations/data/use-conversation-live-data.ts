import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { listen } from '@tauri-apps/api/event';

import { conversationsApi } from '@/features/conversations/apis/conversations-api';
import { ConversationLivePhase } from '@/features/conversations/data/conversation-live-phase';
import { conversationQueryKeys } from '@/features/conversations/queries/conversation-query-keys';
import type { Conversation } from '@/features/conversations/types/conversation';
import { toastError } from '@/features/toasts/actions/toast-error';
import { ConversationEventNames } from '@/shared/events/conversation-event-names';
import { AppError } from '@/shared/invoke/app-error';
import { ErrorCode } from '@/shared/types/error-code';

interface UseConversationLiveDataResult {
  conversation: Conversation | null;
  phase: ConversationLivePhase;
  error: unknown;
  retry: () => void;
}

function isNotFound(error: unknown): boolean {
  return error instanceof AppError && error.code === ErrorCode.NotFound;
}

export function useConversationLiveData(
  conversationId: string,
  onConversationGone: () => void,
): UseConversationLiveDataResult {
  const queryClient = useQueryClient();

  const [conversation, setConversation] = React.useState<Conversation | null>(
    (): Conversation | null =>
      queryClient.getQueryData<Conversation>(conversationQueryKeys.single(conversationId)) ?? null,
  );

  const [phase, setPhase] = React.useState<ConversationLivePhase>((): ConversationLivePhase => {
    const cached = queryClient.getQueryData<Conversation>(
      conversationQueryKeys.single(conversationId),
    );
    return cached !== undefined
      ? ConversationLivePhase.WarmLoading
      : ConversationLivePhase.ColdLoading;
  });

  const [error, setError] = React.useState<unknown>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  const phaseRef = React.useRef(phase);
  const conversationRef = React.useRef(conversation);
  const bufferRef = React.useRef<Conversation[]>([]);

  React.useEffect((): void => {
    phaseRef.current = phase;
  }, [phase]);

  React.useEffect((): void => {
    conversationRef.current = conversation;
  }, [conversation]);

  const updateConversation = React.useCallback(
    (next: Conversation): void => {
      setConversation(next);
      conversationRef.current = next;
      queryClient.setQueryData<Conversation>(conversationQueryKeys.single(next.id), next);
    },
    [queryClient],
  );

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const isAborted = (): boolean => signal.aborted;
    let savesStreamKey: string | null = null;
    const unlisteners: (() => void)[] = [];

    const handleSaveEvent = (incoming: Conversation): void => {
      if (incoming.id !== conversationId) {
        return;
      }
      if (phaseRef.current === ConversationLivePhase.Ready) {
        updateConversation(incoming);
        return;
      }
      bufferRef.current.push(incoming);
    };

    const handleDeleteEvent = (deletedId: string): void => {
      if (deletedId !== conversationId) {
        return;
      }
      onConversationGone();
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

        savesStreamKey = await conversationsApi.watchSavesStart(conversationId);
        if (isAborted()) {
          return;
        }

        let fetched: Conversation;
        try {
          fetched = await conversationsApi.get(conversationId);
        } catch (caught) {
          if (isAborted()) {
            return;
          }
          if (isNotFound(caught)) {
            onConversationGone();
            return;
          }
          throw caught;
        }
        if (isAborted()) {
          return;
        }

        let drained: Conversation = fetched;
        for (const event of bufferRef.current) {
          drained = event;
        }
        bufferRef.current = [];

        updateConversation(drained);
        setPhase(ConversationLivePhase.Ready);
      } catch (caught) {
        if (isAborted()) {
          return;
        }
        setError(caught);
        setPhase(ConversationLivePhase.Error);
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
    };
  }, [conversationId, reloadKey, updateConversation, onConversationGone]);

  const retry = React.useCallback((): void => {
    setError(null);
    setPhase(ConversationLivePhase.ColdLoading);
    bufferRef.current = [];
    setReloadKey((key): number => key + 1);
  }, []);

  return { conversation, phase, error, retry };
}
