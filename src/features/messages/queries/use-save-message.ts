import { type DefaultError, type UseMutationResult, useMutation } from '@tanstack/react-query';

import { messagesApi } from '@/features/messages/apis/messages-api';
import type { Message } from '@/features/messages/types/message';
import type { MessageContentUserInput } from '@/features/messages/types/message-content-user-input';

interface SaveMessageArgs {
  input: MessageContentUserInput;
  id: string | null;
}

export function useSaveMessage(): UseMutationResult<Message, DefaultError, SaveMessageArgs> {
  return useMutation({
    mutationFn: (args: SaveMessageArgs): Promise<Message> => messagesApi.save(args.input, args.id),
  });
}
