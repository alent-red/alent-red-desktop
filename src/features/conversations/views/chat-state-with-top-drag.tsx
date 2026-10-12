import * as React from 'react';

interface ChatStateWithTopDragProps {
  children: React.ReactNode;
}

// Adds a 40px absolute drag strip across the top of a non-interactive chat
// state (empty/loading/error) so the user can still drag the window from that
// area without pushing the centered content down.
export const ChatStateWithTopDrag = ({
  children,
}: ChatStateWithTopDragProps): React.ReactElement => {
  return (
    <div className="relative flex-1 flex flex-col">
      <div
        data-tauri-drag-region
        aria-hidden
        className="absolute top-0 left-0 right-0 z-[1]"
        style={{ height: 'var(--titlebar-safe-area)' }}
      />
      {children}
    </div>
  );
};
