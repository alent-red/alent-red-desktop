import * as React from 'react';

interface PanelResizerProps {
  width: number;
  onChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

const KEYBOARD_STEP_DEFAULT_PX = 8;
const KEYBOARD_STEP_SHIFT_PX = 24;
const PANEL_RESIZER_MIN_WIDTH_PX = 240;
const PANEL_RESIZER_MAX_WIDTH_PX = 480;

export const PanelResizer = ({
  width,
  onChange,
  minWidth = PANEL_RESIZER_MIN_WIDTH_PX,
  maxWidth = PANEL_RESIZER_MAX_WIDTH_PX,
}: PanelResizerProps): React.ReactElement => {
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(width);
  const [isDragging, setIsDragging] = React.useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    event.preventDefault();
    startXRef.current = event.clientX;
    startWidthRef.current = width;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDragging) {
      return;
    }
    const delta = event.clientX - startXRef.current;
    const next = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + delta));
    onChange(next);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const step = event.shiftKey ? KEYBOARD_STEP_SHIFT_PX : KEYBOARD_STEP_DEFAULT_PX;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onChange(Math.max(minWidth, width - step));
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onChange(Math.min(maxWidth, width + step));
    }
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={width}
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="group relative w-px shrink-0 cursor-col-resize bg-[var(--border-subtle)] hover:bg-[var(--border-strong)] transition-colors"
      data-dragging={isDragging ? 'true' : undefined}
    >
      <div className="absolute inset-y-0 -left-[3px] -right-[3px]" aria-hidden />
    </div>
  );
};
