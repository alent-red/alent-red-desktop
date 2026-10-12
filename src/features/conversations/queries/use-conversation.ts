import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { conversationsApi } from '@/features/conversations/apis/conversations-api';
import { conversationQueryKeys } from '@/features/conversations/queries/conversation-query-keys';
import type { Conversation } from '@/features/conversations/types/conversation';

export function useConversation(
  id: string | null | undefined,
): UseQueryResult<Conversation | null> {
  const isEnabled = id !== null && id !== undefined && id !== '';
  return useQuery({
    queryKey: isEnabled ? conversationQueryKeys.single(id) : ['conversation', null],
    queryFn: (): Promise<Conversation | null> =>
      isEnabled ? conversationsApi.get(id) : Promise.resolve(null),
    enabled: isEnabled,
  });
}
