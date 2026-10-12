import * as React from 'react';

// Reveals streamed text progressively instead of in bursts. Each frame
// uncovers a slice proportional to the backlog, so the display never lags far
// behind the real text and catches up smoothly after a big chunk. Text that is
// already complete on mount (an old conversation) is shown at once.
const MIN_CHARACTERS_PER_FRAME = 2;
const BACKLOG_DIVISOR = 12;

export function useStreamedText(text: string): string {
  const [displayed, setDisplayed] = React.useState(text);
  const displayedRef = React.useRef(text);
  const frameRef = React.useRef<number | null>(null);

  React.useEffect((): (() => void) | undefined => {
    const current = displayedRef.current;
    const isContinuation = text.length > current.length && text.startsWith(current);
    if (!isContinuation) {
      displayedRef.current = text;
      setDisplayed(text);
      return undefined;
    }
    const step = (): void => {
      const shown = displayedRef.current.length;
      const backlog = text.length - shown;
      if (backlog <= 0) {
        frameRef.current = null;
        return;
      }
      const slice = Math.max(MIN_CHARACTERS_PER_FRAME, Math.ceil(backlog / BACKLOG_DIVISOR));
      const next = text.slice(0, shown + slice);
      displayedRef.current = next;
      setDisplayed(next);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return (): void => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [text]);

  return displayed;
}
