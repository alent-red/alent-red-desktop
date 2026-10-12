import type { ConversationSender } from '@/features/conversations/types/conversation-sender';
import type { ErrorCode } from '@/shared/types/error-code';

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string | null;
  processing: boolean;
  errorCode: ErrorCode | null;
  errorMessage: string | null;
  agentId: string | null;
  gatewayId: string | null;
  gatewayExternalId: string | null;
  sender: ConversationSender | null;
  contextTokensCount: number | null;
}
