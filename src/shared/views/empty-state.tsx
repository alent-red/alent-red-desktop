import * as React from 'react';

import { Plus, type LucideIcon } from 'lucide-react';

import { Button } from '@/shared/views/button';

interface EmptyStateCta {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  cta?: EmptyStateCta;
}

export const EmptyState = ({
  icon,
  title,
  description,
  cta,
}: EmptyStateProps): React.ReactElement => {
  const Icon = icon;
  const CtaIcon = cta?.icon ?? Plus;
  const hasDescription = description !== undefined && description.length > 0;
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 px-8 py-6 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-active)] text-[var(--text-muted)]">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <div className="flex flex-col gap-1 max-w-[320px]">
        <div className="text-[14px] font-semibold text-primary">{title}</div>
        {hasDescription ? (
          <div className="text-[12.5px] text-muted leading-relaxed">{description}</div>
        ) : null}
      </div>
      {cta !== undefined ? (
        <Button variant="primary" size="sm" onClick={cta.onClick} className="mt-1">
          <CtaIcon size={13} />
          {cta.label}
        </Button>
      ) : null}
    </div>
  );
};
