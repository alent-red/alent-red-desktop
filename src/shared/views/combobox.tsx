import * as React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk';
import { Check, ChevronDown, Search } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Combobox = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled,
  isInvalid,
  className,
  size = 'md',
}: ComboboxProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(false);
  const selected = React.useMemo<ComboboxOption | null>(
    (): ComboboxOption | null => options.find((option): boolean => option.value === value) ?? null,
    [options, value],
  );

  const placeholderText = placeholder ?? translate('common.select');
  const searchPlaceholderText = searchPlaceholder ?? translate('common.search');
  const emptyMessageText = emptyMessage ?? translate('common.nothingFound');

  const triggerHeight = size === 'sm' ? 'h-8' : 'h-9';

  return (
    <PopoverPrimitive.Root
      open={isOpen}
      onOpenChange={(next): void => {
        if (disabled !== true) {
          setIsOpen(next);
        }
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          data-invalid={isInvalid === true ? 'true' : undefined}
          className={mergeClasses(
            'inline-flex w-full items-center justify-between gap-2',
            triggerHeight,
            'rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-input)]',
            'px-3 text-[13px] text-[var(--text-primary)]',
            'transition-colors duration-[140ms]',
            'hover:bg-[var(--bg-hover)]',
            'focus-visible:outline-none focus-visible:border-[var(--color-brand)] focus-visible:shadow-[0_0_0_3px_var(--color-focus-ring)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'data-[invalid=true]:border-[var(--color-danger)]',
            className,
          )}
        >
          <span
            className={mergeClasses(
              'truncate text-left flex-1',
              selected === null && 'text-[var(--text-muted)]',
            )}
          >
            {selected !== null ? selected.label : placeholderText}
          </span>
          <ChevronDown size={13} className="text-[var(--text-muted)] shrink-0" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className={mergeClasses(
            'z-[170] w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-[10px]',
            'bg-[var(--bg-surface-raised)] border border-[var(--border-default)]',
            'shadow-[var(--shadow-lg)]',
            'data-[state=open]:animate-[content-in_140ms_cubic-bezier(0.16,1,0.3,1)]',
          )}
        >
          <Command className="flex flex-col" shouldFilter>
            <div className="flex items-center gap-1.5 border-b border-subtle px-2.5">
              <Search size={12} className="text-[var(--text-muted)] shrink-0" />
              <CommandInput
                placeholder={searchPlaceholderText}
                className={mergeClasses(
                  'flex-1 h-8 bg-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none border-0',
                )}
              />
            </div>
            <CommandList className="max-h-[260px] overflow-y-auto p-1">
              <CommandEmpty className="px-2 py-2 text-[12.5px] text-[var(--text-muted)] text-center">
                {emptyMessageText}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option): React.ReactElement => {
                  const isSelected = option.value === value;
                  const hasDescription =
                    option.description !== undefined && option.description.length > 0;
                  return (
                    <CommandItem
                      key={option.value}
                      value={`${option.label} ${option.description ?? ''}`}
                      onSelect={(): void => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={mergeClasses(
                        'flex items-start gap-2 rounded-[6px] px-2 py-1.5 text-[13px] cursor-pointer',
                        'text-[var(--text-primary)] outline-none transition-colors',
                        'data-[selected=true]:bg-[var(--bg-hover)]',
                        'aria-selected:bg-[var(--bg-hover)]',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate">{option.label}</div>
                        {hasDescription ? (
                          <div className="text-[11px] text-[var(--text-muted)] truncate">
                            {option.description}
                          </div>
                        ) : null}
                      </div>
                      {isSelected ? (
                        <Check size={13} className="text-[var(--color-brand)] shrink-0 mt-0.5" />
                      ) : null}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
