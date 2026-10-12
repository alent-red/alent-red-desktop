import * as React from 'react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Spinner } from '@/shared/views/spinner';

interface LoadingStateProps {
  size?: number;
  label?: string;
  className?: string;
}

const LOADING_STATE_DEFAULT_SIZE_PX = 28;
const LOADING_STATE_STROKE_WIDTH = 2.4;

export const LoadingState = ({
  size = LOADING_STATE_DEFAULT_SIZE_PX,
  label,
  className,
}: LoadingStateProps): React.ReactElement => {
  const hasLabel = label !== undefined && label.length > 0;
  return (
    <div
      role="status"
      aria-label={label ?? translate('common.loading')}
      className={mergeClasses(
        'h-full w-full flex flex-col items-center justify-center gap-2',
        className,
      )}
    >
      <Spinner
        size={size}
        strokeWidth={LOADING_STATE_STROKE_WIDTH}
        className="text-[var(--color-brand)]"
      />
      {hasLabel ? <div className="text-[12.5px] text-muted">{label}</div> : null}
    </div>
  );
};
