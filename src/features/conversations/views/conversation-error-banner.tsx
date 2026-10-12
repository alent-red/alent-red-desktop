import * as React from 'react';

import { AlertCircle } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { presentError } from '@/shared/lib/present-error';
import type { ErrorCode } from '@/shared/types/error-code';

interface ConversationErrorBannerProps {
  errorCode: ErrorCode;
  message: string | null;
}

export const ConversationErrorBanner = ({
  errorCode,
  message,
}: ConversationErrorBannerProps): React.ReactElement => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const presented = presentError({ code: errorCode, message });
  const hasDetail = presented.detail !== null && presented.detail.length > 0;
  return (
    <div className="flex items-start gap-2 px-4 py-2 bg-[var(--color-danger-bg)] border-b border-[var(--border-subtle)]">
      <AlertCircle size={13} className="mt-0.5 text-[var(--color-danger)] shrink-0" />
      <div className="flex-1 min-w-0 text-[12.5px] text-[var(--color-danger)]">
        <div className="font-medium">{presented.title}</div>
        {hasDetail && isExpanded ? (
          <div className="mt-1 font-mono text-[11.5px] text-secondary whitespace-pre-wrap break-words">
            {presented.detail}
          </div>
        ) : null}
      </div>
      {hasDetail ? (
        <button
          type="button"
          className="text-[11.5px] text-[var(--color-danger)] hover:underline underline-offset-2"
          onClick={(): void => {
            setIsExpanded((previous): boolean => !previous);
          }}
        >
          {isExpanded ? translate('common.hideDetails') : translate('common.showDetails')}
        </button>
      ) : null}
    </div>
  );
};
