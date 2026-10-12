import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';

interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  showClose?: boolean;
  size?: 'sm' | 'md' | 'lg';
  // When this dialog is rendered on top of another dialog, set `isNested` so
  // its overlay + content render above the parent's z-band. Default z-band is
  // 150/151; nested adds 10 to lift both above the parent without colliding
  // with toasts (180) or tooltips (200).
  isNested?: boolean;
}

const SIZE_MAP: Record<NonNullable<DialogContentProps['size']>, string> = {
  sm: 'max-w-[420px]',
  md: 'max-w-[520px]',
  lg: 'max-w-[640px]',
};

interface DialogOverlayProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
> {
  zClassName: string;
}

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(
  ({ className, zClassName, ...props }, ref): React.ReactElement => (
    <DialogPrimitive.Overlay
      ref={ref}
      className={mergeClasses(
        'fixed inset-0',
        zClassName,
        'bg-[var(--bg-overlay)] backdrop-blur-[8px]',
        'data-[state=open]:animate-[overlay-in_140ms_cubic-bezier(0.16,1,0.3,1)]',
        className,
      )}
      {...props}
    />
  ),
);
DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { className, children, showClose = true, size = 'md', isNested = false, ...props },
    ref,
  ): React.ReactElement => (
    <DialogPrimitive.Portal>
      <DialogOverlay zClassName={isNested ? 'z-[160]' : 'z-[150]'} />
      <DialogPrimitive.Content
        ref={ref}
        className={mergeClasses(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          isNested ? 'z-[161]' : 'z-[151]',
          'w-[calc(100vw-48px)] max-h-[85vh] flex flex-col',
          SIZE_MAP[size],
          'bg-[var(--bg-surface-raised)] rounded-[14px]',
          'border border-[var(--border-default)]',
          'shadow-[var(--shadow-xl)]',
          'data-[state=open]:animate-[content-in_180ms_cubic-bezier(0.16,1,0.3,1)]',
          'focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            aria-label={translate('common.close')}
            className={mergeClasses(
              'absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-[6px]',
              'text-[var(--text-muted)] transition-colors duration-[140ms]',
              'hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
            )}
          >
            <X size={15} strokeWidth={2.25} />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  ),
);
DialogContent.displayName = 'DialogContent';
