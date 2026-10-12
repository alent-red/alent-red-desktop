import * as React from 'react';

import { Boxes } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { EmptyState } from '@/shared/views/empty-state';

interface BricksEmptyStateProps {
  onAdd: () => void;
}

export const BricksEmptyState = ({ onAdd }: BricksEmptyStateProps): React.ReactElement => {
  return (
    <EmptyState
      icon={Boxes}
      title={translate('bricks.noBricksTitle')}
      description={translate('bricks.noBricksBody')}
      cta={{ label: translate('bricks.addBrick'), onClick: onAdd }}
    />
  );
};
