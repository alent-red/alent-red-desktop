import * as React from 'react';

import type { Provider } from '@/features/providers/types/provider';
import { ProviderRow } from '@/features/providers/views/provider-row';
import { ProvidersEmptyState } from '@/features/providers/views/providers-empty-state';
import { translate } from '@/shared/i18n/translate';

interface ProvidersListProps {
  providers: Provider[];
  filteredProviders: Provider[];
  query: string;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (provider: Provider) => void;
}

export const ProvidersList = ({
  providers,
  filteredProviders,
  query,
  onAdd,
  onEdit,
  onDelete,
}: ProvidersListProps): React.ReactElement => {
  if (providers.length === 0) {
    return <ProvidersEmptyState onAdd={onAdd} />;
  }
  if (filteredProviders.length === 0) {
    return (
      <div className="text-muted text-[12.5px] text-center py-8">
        {translate('providers.noProvidersMatching', { query: query.trim() })}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {filteredProviders.map(
        (provider): React.ReactElement => (
          <ProviderRow key={provider.id} provider={provider} onEdit={onEdit} onDelete={onDelete} />
        ),
      )}
    </ul>
  );
};
