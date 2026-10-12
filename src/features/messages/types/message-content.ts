import type { MessageContentToolResponse } from '@/features/messages/types/message-content-tool-response';
import { type MessageContentType } from '@/features/messages/types/message-content-type';
import type { ErrorCode } from '@/shared/types/error-code';

export type MessageContent =
  | { type: typeof MessageContentType.Internal; text: string }
  | { type: typeof MessageContentType.User; text: string; attachedFilePaths: string[] }
  | { type: typeof MessageContentType.Ai; text: string }
  | {
      type: typeof MessageContentType.Tool;
      name: string;
      processing: boolean;
      error: ErrorCode | null;
      request: string;
      response: MessageContentToolResponse | null;
    };
