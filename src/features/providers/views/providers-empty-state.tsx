import * as React from 'react';

import { Server } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { EmptyState } from '@/shared/views/empty-state';

interface ProvidersEmptyStateProps {
  onAdd: () => void;
}

export const ProvidersEmptyState = ({ onAdd }: ProvidersEmptyStateProps): React.ReactElement => {
  return (
    <EmptyState
      icon={Server}
      title={translate('providers.noProvidersTitle')}
      description={translate('providers.noProvidersBody')}
      cta={{ label: translate('providers.addProvider'), onClick: onAdd }}
    />
  );
};
