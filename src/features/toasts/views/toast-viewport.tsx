import * as React from 'react';

import * as ToastPrimitive from '@radix-ui/react-toast';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  TriangleAlert,
  X,
} from 'lucide-react';

import { useToastStore } from '@/features/toasts/stores/toast-store';
import type { Toast } from '@/features/toasts/types/toast';
import { ToastVariant } from '@/features/toasts/types/toast-variant';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';

const VARIANT_BORDER: Record<ToastVariant, string> = {
  [ToastVariant.Info]: 'border-l-[var(--color-info)]',
  [ToastVariant.Success]: 'border-l-[var(--color-success)]',
  [ToastVariant.Warning]: 'border-l-[var(--color-warning)]',
  [ToastVariant.Danger]: 'border-l-[var(--color-danger)]',
};

const VARIANT_ICON_COMPONENT: Record<ToastVariant, typeof Info> = {
  [ToastVariant.Info]: Info,
  [ToastVariant.Success]: CheckCircle2,
  [ToastVariant.Warning]: TriangleAlert,
  [ToastVariant.Danger]: AlertCircle,
};

const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  [ToastVariant.Info]: 'text-[var(--color-info)]',
  [ToastVariant.Success]: 'text-[var(--color-success)]',
  [ToastVariant.Warning]: 'text-[var(--color-warning)]',
  [ToastVariant.Danger]: 'text-[var(--color-danger)]',
};

interface VariantIconProps {
  variant: ToastVariant;
}

const VariantIcon = ({ variant }: VariantIconProps): React.ReactElement => {
  const IconComponent = VARIANT_ICON_COMPONENT[variant];
  return <IconComponent size={16} strokeWidth={2.2} className={VARIANT_ICON_COLOR[variant]} />;
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: () => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps): React.ReactElement => {
  const [isShowingDetails, setIsShowingDetails] = React.useState(false);
  const hasDetails = toast.description !== null && toast.description.length > 0;

  return (
    <ToastPrimitive.Root
      open
      onOpenChange={(open): void => {
        if (!open) {
          onDismiss();
        }
      }}
      className={mergeClasses(
        'relative grid grid-cols-[auto,1fr] items-start gap-2.5 rounded-[10px]',
        'bg-[var(--bg-surface-raised)] border border-[var(--border-default)] border-l-4',
        'pl-3 pr-9 py-2.5 shadow-[var(--shadow-lg)]',
        'data-[state=open]:animate-[content-in_200ms_cubic-bezier(0.16,1,0.3,1)]',
        'data-[state=closed]:opacity-0 transition-opacity',
        VARIANT_BORDER[toast.variant],
      )}
    >
      <span className="mt-0.5">
        <VariantIcon variant={toast.variant} />
      </span>
      <div className="min-w-0">
        <ToastPrimitive.Title className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">
          {toast.title}
        </ToastPrimitive.Title>
        {hasDetails && isShowingDetails ? (
          <ToastPrimitive.Description className="mt-1 text-[11.5px] text-[var(--text-muted)] font-mono leading-snug whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto">
            {toast.description}
          </ToastPrimitive.Description>
        ) : null}
        <div className="flex items-center gap-2 mt-1">
          {hasDetails ? (
            <button
              type="button"
              onClick={(): void => {
                setIsShowingDetails((value): boolean => !value);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] underline-offset-2 hover:underline"
            >
              {isShowingDetails ? (
                <ChevronUp size={11} strokeWidth={2.2} />
              ) : (
                <ChevronDown size={11} strokeWidth={2.2} />
              )}
              {isShowingDetails ? translate('common.hideDetails') : translate('common.showDetails')}
            </button>
          ) : null}
          {toast.action !== null ? (
            <ToastPrimitive.Action
              altText={toast.action.label}
              onClick={(): void => {
                toast.action?.onSelect();
              }}
              className="text-[11px] font-medium text-[var(--color-brand)] hover:underline underline-offset-2"
            >
              {toast.action.label}
            </ToastPrimitive.Action>
          ) : null}
        </div>
      </div>
      <ToastPrimitive.Close
        aria-label={translate('common.dismiss')}
        className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-[6px] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X size={13} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};

export const ToastViewport = (): React.ReactElement => {
  const toasts = useToastStore((state): Toast[] => state.toasts);
  const dismiss = useToastStore((state): typeof state.dismiss => state.dismiss);

  return (
    <ToastPrimitive.Provider duration={Infinity} swipeDirection="right">
      {toasts.map(
        (toast): React.ReactElement => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={(): void => {
              dismiss(toast.id);
            }}
          />
        ),
      )}
      <ToastPrimitive.Viewport
        className={mergeClasses(
          'fixed bottom-4 right-4 z-[180] flex flex-col gap-2 outline-none',
          'w-[360px] max-w-[calc(100vw-32px)]',
        )}
      />
    </ToastPrimitive.Provider>
  );
};
