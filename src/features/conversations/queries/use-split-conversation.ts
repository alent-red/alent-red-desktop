import { type DefaultError, type UseMutationResult, useMutation } from '@tanstack/react-query';

import { conversationsApi } from '@/features/conversations/apis/conversations-api';
import type { Conversation } from '@/features/conversations/types/conversation';

export function useSplitConversation(): UseMutationResult<Conversation, DefaultError, string> {
  return useMutation({
    mutationFn: (splitAtMessageId: string): Promise<Conversation> =>
      conversationsApi.split(splitAtMessageId),
  });
}
