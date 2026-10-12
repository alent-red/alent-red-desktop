import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg' | 'windowsCaption';
}

// `windowsCaption` matches the native caption buttons the Windows plugin
// injects: same dimensions, no border-radius, hover background matching the
// plugin's rgba(0/255,0/255,0/255,0.1), and no icon-color shift on hover
// (the natives leave the SVG color alone). The other sizes keep the original
// hover wash + text-primary lift used everywhere else in the app.
const SIZE_CLASSES: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'h-7 w-7 rounded-[8px] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
  md: 'h-9 w-9 rounded-[8px] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
  lg: 'h-10 w-10 rounded-[8px] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
  windowsCaption:
    'h-[var(--titlebar-safe-area)] w-[calc(var(--tauri-frame-controls-width,138px)/3)] rounded-none hover:bg-black/10 dark:hover:bg-white/10',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, isActive, ariaLabel, size = 'md', children, ...props },
    ref,
  ): React.ReactElement => (
    <button
      ref={ref}
      aria-label={ariaLabel}
      data-active={isActive === true ? 'true' : undefined}
      className={mergeClasses(
        'inline-flex items-center justify-center',
        'text-[var(--text-secondary)] transition-colors duration-[140ms]',
        'active:bg-[var(--bg-active)]',
        'data-[active=true]:bg-[var(--bg-active)] data-[active=true]:text-[var(--text-primary)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-rail)]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';
