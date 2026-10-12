import { type BufferedConversationEventType } from '@/features/conversations/data/buffered-conversation-event-type';
import type { Conversation } from '@/features/conversations/types/conversation';

export type BufferedConversationEvent =
  | { type: typeof BufferedConversationEventType.Save; conversation: Conversation }
  | { type: typeof BufferedConversationEventType.Delete; id: string };
