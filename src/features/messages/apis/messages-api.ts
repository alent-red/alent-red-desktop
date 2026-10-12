import type { Message } from '@/features/messages/types/message';
import type { MessageContentUserInput } from '@/features/messages/types/message-content-user-input';
import { invoke } from '@/shared/invoke/invoke';

interface GetAllMessagesParams {
  conversationId: string;
  beforeMessageId: string | null;
  count: number | null;
}

export const messagesApi = {
  getAll: (params: GetAllMessagesParams): Promise<Message[]> =>
    invoke<Message[]>('messages_get_all', {
      conversationId: params.conversationId,
      beforeMessageId: params.beforeMessageId ?? undefined,
      count: params.count ?? undefined,
    }),
  save: (messageContentUserInput: MessageContentUserInput, id: string | null): Promise<Message> =>
    invoke<Message>('messages_save', { id: id ?? undefined, messageContentUserInput }),
  watchSavesStart: (conversationId: string): Promise<string> =>
    invoke<string>('messages_watch_saves_start', { conversationId }),
  watchSavesStop: (key: string): Promise<boolean> =>
    invoke<boolean>('messages_watch_saves_stop', { key }),
  watchDeleteAftersStart: (conversationId: string): Promise<string> =>
    invoke<string>('messages_watch_delete_afters_start', { conversationId }),
  watchDeleteAftersStop: (key: string): Promise<boolean> =>
    invoke<boolean>('messages_watch_delete_afters_stop', { key }),
};
