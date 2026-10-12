import * as React from 'react';

import TextareaAutosize from 'react-textarea-autosize';

import { mergeClasses } from '@/shared/lib/merge-classes';

export interface AutoTextareaProps extends React.ComponentProps<typeof TextareaAutosize> {
  isInvalid?: boolean;
  isResizable?: boolean;
}

// Autosize keeps the default height in sync with the content. When resizable,
// a manual drag of the handle is remembered as a minimum height so autosize
// never shrinks the field back below what the user chose.
function rememberManualHeight(event: React.PointerEvent<HTMLTextAreaElement>): void {
  const textarea = event.currentTarget;
  const dragged = textarea.offsetHeight;
  const computed = Number.parseFloat(textarea.style.height);
  if (Number.isFinite(computed) && Math.abs(dragged - computed) > 1) {
    textarea.style.minHeight = `${String(dragged)}px`;
  }
}

export const AutoTextarea = React.forwardRef<HTMLTextAreaElement, AutoTextareaProps>(
  (
    { className, isInvalid, isResizable = false, onPointerUp, ...props },
    ref,
  ): React.ReactElement => (
    <TextareaAutosize
      ref={ref}
      data-invalid={isInvalid === true ? 'true' : undefined}
      onPointerUp={(event): void => {
        if (isResizable) {
          rememberManualHeight(event);
        }
        onPointerUp?.(event);
      }}
      className={mergeClasses(
        'w-full rounded-[8px] bg-[var(--bg-input)]',
        isResizable ? 'resize-y' : 'resize-none',
        'border border-[var(--border-default)]',
        'px-3 py-2 text-[14px] leading-[21px] text-[var(--text-primary)]',
        'placeholder:text-[var(--text-muted)]',
        'transition-[border,box-shadow] duration-[140ms]',
        'focus:outline-none focus:border-[var(--color-brand)] focus:shadow-[0_0_0_3px_var(--color-focus-ring)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'data-[invalid=true]:border-[var(--color-danger)]',
        className,
      )}
      {...props}
    />
  ),
);

AutoTextarea.displayName = 'AutoTextarea';
