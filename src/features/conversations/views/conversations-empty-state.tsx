import * as React from 'react';

import { translate } from '@/shared/i18n/translate';

interface ConversationsEmptyStateProps {
  agentFilter: string | null;
  agentName: string | undefined;
  query: string;
  hasAnyAgent: boolean;
}

export const ConversationsEmptyState = ({
  agentFilter,
  agentName,
  query,
  hasAnyAgent,
}: ConversationsEmptyStateProps): React.ReactElement => {
  if (query.trim().length > 0) {
    return (
      <div className="px-4 py-6 text-center text-[12.5px] text-muted">
        {translate('conversations.emptySearch', { query: query.trim() })}
      </div>
    );
  }
  if (agentFilter !== null) {
    return (
      <div className="px-4 py-6 text-center text-[12.5px] text-muted">
        {translate('conversations.emptyAgent', { name: agentName ?? '' })}
      </div>
    );
  }
  return (
    <div className="px-5 py-6 flex flex-col items-center gap-2 text-center">
      <div className="text-[14px] font-semibold text-primary">
        {translate('conversations.emptyAll')}
      </div>
      <div className="text-[12.5px] text-muted max-w-[200px] leading-relaxed">
        {hasAnyAgent
          ? translate('conversations.emptyAllBodyWithAgent')
          : translate('conversations.emptyAllBody')}
      </div>
    </div>
  );
};
