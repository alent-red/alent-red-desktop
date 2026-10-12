import { type DefaultError, type UseMutationResult, useMutation } from '@tanstack/react-query';

import { conversationsApi } from '@/features/conversations/apis/conversations-api';

export function useDeleteConversation(): UseMutationResult<void, DefaultError, string> {
  return useMutation({
    mutationFn: (id: string): Promise<void> => conversationsApi.delete(id),
  });
}
