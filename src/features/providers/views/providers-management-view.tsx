import * as React from 'react';

import { useProviders } from '@/features/providers/queries/use-providers';
import type { Provider } from '@/features/providers/types/provider';
import { ProvidersList } from '@/features/providers/views/providers-list';
import { translate } from '@/shared/i18n/translate';
import { SectionBody } from '@/shared/views/section-body';
import { SectionHeader } from '@/shared/views/section-header';

export interface ProvidersManagementViewProps {
  onAddProvider: () => void;
  onEditProvider: (id: string) => void;
  onDeleteProvider: (provider: Provider) => void;
}

export const ProvidersManagementView = ({
  onAddProvider,
  onEditProvider,
  onDeleteProvider,
}: ProvidersManagementViewProps): React.ReactElement => {
  const { data: providers = [], isLoading, isError, error, refetch, isFetching } = useProviders();
  const [query, setQuery] = React.useState('');

  const filteredProviders = React.useMemo((): Provider[] => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) {
      return providers;
    }
    return providers.filter((provider): boolean => provider.name.toLowerCase().includes(trimmed));
  }, [providers, query]);

  const handleRefetch = React.useCallback((): void => {
    void refetch();
  }, [refetch]);

  const handleAdd = (): void => {
    onAddProvider();
  };

  const handleEdit = (id: string): void => {
    onEditProvider(id);
  };

  const handleDelete = (provider: Provider): void => {
    onDeleteProvider(provider);
  };

  const isRefreshing = isFetching && !isLoading;

  return (
    <div className="h-full flex flex-col">
      <SectionHeader
        title={translate('providers.title')}
        search={{
          value: query,
          onChange: setQuery,
          placeholder: translate('providers.searchPlaceholder'),
        }}
        onRefresh={handleRefetch}
        isRefreshing={isRefreshing}
        onAdd={handleAdd}
        addLabel={translate('providers.addProvider')}
      />
      <SectionBody
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        onRetry={handleRefetch}
      >
        <ProvidersList
          providers={providers}
          filteredProviders={filteredProviders}
          query={query}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </SectionBody>
    </div>
  );
};
