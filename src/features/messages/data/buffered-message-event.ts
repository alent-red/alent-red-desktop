import { type BufferedMessageEventType } from '@/features/messages/data/buffered-message-event-type';
import type { Message } from '@/features/messages/types/message';

export type BufferedMessageEvent =
  | { type: typeof BufferedMessageEventType.Save; message: Message }
  | { type: typeof BufferedMessageEventType.DeleteAfter; anchorId: string };
