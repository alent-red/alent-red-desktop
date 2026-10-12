import * as React from 'react';

import { FileText } from 'lucide-react';

import { extractPathBasename } from '@/shared/lib/extract-path-basename';

interface LocalPathLinkProps {
  path: string;
  onOpen: (path: string) => void;
}

export const LocalPathLink = ({ path, onOpen }: LocalPathLinkProps): React.ReactElement => (
  <button
    type="button"
    title={path}
    onClick={(): void => {
      onOpen(path);
    }}
    className="inline-flex max-w-full items-center gap-1 align-baseline rounded-[6px] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-1.5 py-0.5 text-[12px] text-[var(--text-primary)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
  >
    <FileText size={11} className="shrink-0 text-[var(--text-muted)]" />
    <span className="truncate">{extractPathBasename(path)}</span>
  </button>
);
