import * as React from 'react';

import { translate } from '@/shared/i18n/translate';
import { Tooltip } from '@/shared/views/tooltip';
import { UsageRing } from '@/shared/views/usage-ring';

interface MessageContextUsageProps {
  usedTokensCount: number | null;
  windowTokensCount: number | null;
}

// Thousands are grouped with a narrow no-break space regardless of the
// machine locale, so the number reads the same everywhere in an English UI.
const THOUSANDS_SEPARATOR = '\u202f';

function formatTokens(count: number): string {
  return count.toLocaleString('en-US').replace(/,/g, THOUSANDS_SEPARATOR);
}

// Rendered only once both the conversation context size and the model's
// window are known; before that there is nothing meaningful to show.
export const MessageContextUsage = ({
  usedTokensCount,
  windowTokensCount,
}: MessageContextUsageProps): React.ReactElement | null => {
  if (usedTokensCount === null || windowTokensCount === null || windowTokensCount <= 0) {
    return null;
  }
  const ratio = usedTokensCount / windowTokensCount;
  // Truncated, so 100 only shows once the window is really full.
  const percent = Math.floor(ratio * 100);
  const label = translate('messages.contextUsage', {
    used: formatTokens(usedTokensCount),
    window: formatTokens(windowTokensCount),
    percent: String(percent),
  });
  return (
    <Tooltip content={label}>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(100, percent)}
        className="inline-flex h-7 w-7 items-center justify-center"
      >
        <UsageRing ratio={ratio} />
      </div>
    </Tooltip>
  );
};
