import * as React from 'react';

import { Cpu } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { EmptyState } from '@/shared/views/empty-state';

interface LlmModelsEmptyStateProps {
  onAdd: () => void;
}

export const LlmModelsEmptyState = ({ onAdd }: LlmModelsEmptyStateProps): React.ReactElement => {
  return (
    <EmptyState
      icon={Cpu}
      title={translate('llmModels.noModelsTitle')}
      description={translate('llmModels.noModelsBody')}
      cta={{ label: translate('llmModels.addModel'), onClick: onAdd }}
    />
  );
};
