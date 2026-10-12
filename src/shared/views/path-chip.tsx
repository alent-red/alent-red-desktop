import * as React from 'react';

import { Paperclip, X } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { extractPathBasename } from '@/shared/lib/extract-path-basename';
import { truncateMiddle } from '@/shared/lib/truncate-middle';

interface PathChipProps {
  path: string;
  isDisabled: boolean;
  onRemove: (path: string) => void;
}

const PATH_NAME_MAX_CHARS = 28;

export const PathChip = ({ path, isDisabled, onRemove }: PathChipProps): React.ReactElement => {
  const handleRemoveClick = (): void => {
    onRemove(path);
  };
  return (
    <span
      title={path}
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border-default)] bg-[var(--bg-surface)] pl-2 pr-1 py-0.5 text-[11.5px] text-[var(--text-secondary)]"
    >
      <Paperclip size={10} className="text-[var(--text-muted)] shrink-0" />
      <span>{truncateMiddle(extractPathBasename(path), PATH_NAME_MAX_CHARS)}</span>
      <button
        type="button"
        aria-label={translate('common.removeAttachment')}
        onClick={handleRemoveClick}
        disabled={isDisabled}
        className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
      >
        <X size={9} strokeWidth={2.4} />
      </button>
    </span>
  );
};
