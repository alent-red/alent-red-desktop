import * as React from 'react';

import { Cable } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { EmptyState } from '@/shared/views/empty-state';

interface GatewaysEmptyStateProps {
  onAdd: () => void;
}

export const GatewaysEmptyState = ({ onAdd }: GatewaysEmptyStateProps): React.ReactElement => {
  return (
    <EmptyState
      icon={Cable}
      title={translate('gateways.noGatewaysTitle')}
      description={translate('gateways.noGatewaysBody')}
      cta={{ label: translate('gateways.addGateway'), onClick: onAdd }}
    />
  );
};
