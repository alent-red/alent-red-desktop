import * as React from 'react';

import type { Message } from '@/features/messages/types/message';
import { MessageContentType } from '@/features/messages/types/message-content-type';

export interface MessagesAutoScroll {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  isFollowing: boolean;
  jumpToLatest: () => void;
}

// Distance from the bottom under which the user counts as "at the bottom".
const FOLLOW_THRESHOLD_PX = 24;
// Scroll events landing within this window after a programmatic scroll are
// ours, not the user's, and must not break following.
const PROGRAMMATIC_SCROLL_WINDOW_MS = 150;

function isNearBottom(container: HTMLDivElement): boolean {
  return (
    container.scrollHeight - container.scrollTop - container.clientHeight <= FOLLOW_THRESHOLD_PX
  );
}

function scrollToBottom(
  container: HTMLDivElement,
  lastProgrammaticAtRef: { current: number },
): void {
  lastProgrammaticAtRef.current = performance.now();
  container.scrollTop = container.scrollHeight;
}

// Stick-to-bottom with user override: the list follows new content while the
// user is at the bottom, stops following as soon as they scroll up, and
// resumes when they come back down, press "jump to latest", or send a message.
export function useMessagesAutoScroll(list: Message[], conversationId: string): MessagesAutoScroll {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const isFollowingRef = React.useRef(true);
  const knownIdsRef = React.useRef<Set<string> | null>(null);
  const knownConversationIdRef = React.useRef<string | null>(null);
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const lastProgrammaticAtRef = React.useRef(0);
  const [isFollowing, setIsFollowing] = React.useState(true);

  const setFollowing = React.useCallback((next: boolean): void => {
    if (isFollowingRef.current === next) {
      return;
    }
    isFollowingRef.current = next;
    setIsFollowing(next);
  }, []);

  const jumpToLatest = React.useCallback((): void => {
    const container = scrollRef.current;
    if (container === null) {
      return;
    }
    setFollowing(true);
    scrollToBottom(container, lastProgrammaticAtRef);
  }, [setFollowing]);

  React.useLayoutEffect((): void => {
    const container = scrollRef.current;
    const content = contentRef.current;
    if (container === null || content === null) {
      return;
    }
    // The scroll container only exists once the panel is past its loading
    // phase, so listeners are attached lazily from here, not on mount.
    if (observerRef.current === null) {
      const observer = new ResizeObserver((): void => {
        if (isFollowingRef.current) {
          scrollToBottom(container, lastProgrammaticAtRef);
        }
      });
      observer.observe(content);
      observer.observe(container);
      observerRef.current = observer;
      // Only a deliberate move away from the bottom breaks following: a wheel
      // or trackpad gesture upwards, or a scroll we did not issue ourselves.
      container.addEventListener('wheel', (event: WheelEvent): void => {
        if (event.deltaY < 0) {
          setFollowing(false);
        }
      });
      container.addEventListener('scroll', (): void => {
        if (isNearBottom(container)) {
          setFollowing(true);
          return;
        }
        const isOurs =
          performance.now() - lastProgrammaticAtRef.current < PROGRAMMATIC_SCROLL_WINDOW_MS;
        if (!isOurs) {
          setFollowing(false);
        }
      });
    }
    if (knownConversationIdRef.current !== conversationId || knownIdsRef.current === null) {
      knownConversationIdRef.current = conversationId;
      knownIdsRef.current = new Set(list.map((message): string => message.id));
      setFollowing(true);
      scrollToBottom(container, lastProgrammaticAtRef);
      return;
    }
    const known = knownIdsRef.current;
    let didUserSend = false;
    for (const message of list) {
      if (known.has(message.id)) {
        continue;
      }
      known.add(message.id);
      if (message.content.type === MessageContentType.User) {
        didUserSend = true;
      }
    }
    if (didUserSend) {
      setFollowing(true);
    }
    if (isFollowingRef.current) {
      scrollToBottom(container, lastProgrammaticAtRef);
    }
  }, [list, conversationId, setFollowing]);

  React.useEffect(
    (): (() => void) => (): void => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    },
    [],
  );

  return { scrollRef, contentRef, isFollowing, jumpToLatest };
}
