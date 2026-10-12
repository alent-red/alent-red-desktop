import type { Conversation } from '@/features/conversations/types/conversation';
import type { ConversationInput } from '@/features/conversations/types/conversation-input';
import { invoke } from '@/shared/invoke/invoke';

export const conversationsApi = {
  getAll: (agentId: string | null): Promise<Conversation[]> =>
    invoke<Conversation[]>('conversations_get_all', { agentId: agentId ?? undefined }),
  get: (id: string): Promise<Conversation> => invoke<Conversation>('conversations_get', { id }),
  save: (conversation: ConversationInput, id: string | null): Promise<Conversation> =>
    invoke<Conversation>('conversations_save', { id: id ?? undefined, conversation }),
  delete: (id: string): Promise<void> => invoke('conversations_delete', { id }),
  split: (splitAtMessageId: string): Promise<Conversation> =>
    invoke<Conversation>('conversations_split', { splitAtMessageId }),
  pause: (id: string): Promise<void> => invoke('conversations_pause', { id }),
  watchSavesStart: (conversationId: string | null): Promise<string> =>
    invoke<string>('conversations_watch_saves_start', {
      conversationId: conversationId ?? undefined,
    }),
  watchSavesStop: (key: string): Promise<boolean> =>
    invoke<boolean>('conversations_watch_saves_stop', { key }),
  watchDeletionsStart: (): Promise<string> => invoke<string>('conversations_watch_deletions_start'),
  watchDeletionsStop: (key: string): Promise<boolean> =>
    invoke<boolean>('conversations_watch_deletions_stop', { key }),
};
