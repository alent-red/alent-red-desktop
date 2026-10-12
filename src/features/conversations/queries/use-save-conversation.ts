import { type DefaultError, type UseMutationResult, useMutation } from '@tanstack/react-query';

import { conversationsApi } from '@/features/conversations/apis/conversations-api';
import type { Conversation } from '@/features/conversations/types/conversation';
import type { ConversationInput } from '@/features/conversations/types/conversation-input';

interface SaveConversationArgs {
  input: ConversationInput;
  id: string | null;
}

export function useSaveConversation(): UseMutationResult<
  Conversation,
  DefaultError,
  SaveConversationArgs
> {
  return useMutation({
    mutationFn: (args: SaveConversationArgs): Promise<Conversation> =>
      conversationsApi.save(args.input, args.id),
  });
}
