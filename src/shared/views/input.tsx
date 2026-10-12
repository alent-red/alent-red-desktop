import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, isInvalid, ...props }, ref): React.ReactElement => (
    <input
      ref={ref}
      data-invalid={isInvalid === true ? 'true' : undefined}
      className={mergeClasses(
        'w-full h-9 rounded-[8px] bg-[var(--bg-input)]',
        'border border-[var(--border-default)]',
        'px-3 text-[13px] text-[var(--text-primary)]',
        'placeholder:text-[var(--text-muted)]',
        'transition-[border,box-shadow] duration-[140ms]',
        'focus:outline-none focus:border-[var(--color-brand)] focus:shadow-[0_0_0_3px_var(--color-focus-ring)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'data-[invalid=true]:border-[var(--color-danger)] data-[invalid=true]:focus:shadow-[0_0_0_3px_rgba(220,38,38,0.18)]',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
