import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/lib/merge-classes';

const BUTTON_STYLES = cva(
  [
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap',
    'rounded-[8px] text-[13px] font-medium tracking-[-0.005em]',
    'transition-[background,box-shadow,color,border,transform] duration-[140ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
    'select-none',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-hover)] active:translate-y-[0.5px]',
        secondary:
          'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)] active:translate-y-[0.5px]',
        ghost:
          'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:bg-[var(--bg-active)]',
        danger:
          'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:bg-[var(--color-brand-hover)] active:translate-y-[0.5px]',
        link: 'bg-transparent text-[var(--color-brand)] hover:underline underline-offset-2 px-0',
      },
      size: {
        sm: 'h-7 px-2.5 text-[12px]',
        md: 'h-9 px-3.5',
        lg: 'h-10 px-4 text-[14px]',
        icon: 'h-8 w-8 p-0',
        'icon-sm': 'h-7 w-7 p-0',
        'icon-lg': 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof BUTTON_STYLES> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref): React.ReactElement => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={mergeClasses(BUTTON_STYLES({ variant, size }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
