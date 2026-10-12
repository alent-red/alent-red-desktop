import * as React from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check } from 'lucide-react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(
  ({ className, children, ...props }, ref): React.ReactElement => (
    <SelectPrimitive.Item
      ref={ref}
      className={mergeClasses(
        'relative flex w-full cursor-pointer items-center gap-2 rounded-[6px]',
        'py-1.5 pl-2 pr-7 text-[13px] text-[var(--text-primary)]',
        'outline-none transition-colors',
        'data-[highlighted]:bg-[var(--bg-hover)]',
        'data-[state=checked]:text-[var(--color-brand)]',
        'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex h-4 w-4 items-center justify-center text-[var(--color-brand)]">
        <Check size={12} strokeWidth={2.5} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  ),
);
SelectItem.displayName = 'SelectItem';
