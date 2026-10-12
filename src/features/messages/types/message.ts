import type { MessageContent } from '@/features/messages/types/message-content';

export interface Message {
  id: string;
  createdAt: string;
  updatedAt: string;
  content: MessageContent;
  conversationId: string;
}
