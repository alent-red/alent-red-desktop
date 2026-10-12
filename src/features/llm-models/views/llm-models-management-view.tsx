import * as React from 'react';

import { useLlmModels } from '@/features/llm-models/queries/use-llm-models';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { LlmModelsList } from '@/features/llm-models/views/llm-models-list';
import { useProviders } from '@/features/providers/queries/use-providers';
import type { Provider } from '@/features/providers/types/provider';
import { translate } from '@/shared/i18n/translate';
import { Combobox, type ComboboxOption } from '@/shared/views/combobox';
import { SectionBody } from '@/shared/views/section-body';
import { SectionHeader } from '@/shared/views/section-header';

export interface LlmModelsManagementViewProps {
  onAddLlmModel: () => void;
  onEditLlmModel: (id: string) => void;
  onDeleteLlmModel: (model: LlmModel) => void;
}

const PROVIDER_FILTER_ALL = '__all__';

export const LlmModelsManagementView = ({
  onAddLlmModel,
  onEditLlmModel,
  onDeleteLlmModel,
}: LlmModelsManagementViewProps): React.ReactElement => {
  const [providerFilter, setProviderFilter] = React.useState<string>(PROVIDER_FILTER_ALL);
  const [query, setQuery] = React.useState('');

  const modelsQuery = useLlmModels(null);
  const providersQuery = useProviders();

  const models = React.useMemo((): LlmModel[] => modelsQuery.data ?? [], [modelsQuery.data]);
  const providers = React.useMemo(
    (): Provider[] => providersQuery.data ?? [],
    [providersQuery.data],
  );
  const isLoading = modelsQuery.isLoading || providersQuery.isLoading;
  const isError = modelsQuery.isError || providersQuery.isError;
  const error = modelsQuery.error ?? providersQuery.error;
  const isFetching = modelsQuery.isFetching || providersQuery.isFetching;
  const handleRefetch = React.useCallback((): void => {
    void modelsQuery.refetch();
    void providersQuery.refetch();
  }, [modelsQuery, providersQuery]);

  const providersById = React.useMemo(
    (): Map<string, Provider> =>
      new Map(providers.map((provider): [string, Provider] => [provider.id, provider])),
    [providers],
  );

  const effectiveFilter = React.useMemo((): string => {
    if (providerFilter === PROVIDER_FILTER_ALL) {
      return PROVIDER_FILTER_ALL;
    }
    return providersById.has(providerFilter) ? providerFilter : PROVIDER_FILTER_ALL;
  }, [providerFilter, providersById]);

  if (effectiveFilter !== providerFilter) {
    setProviderFilter(effectiveFilter);
  }

  const filteredByProvider = React.useMemo((): LlmModel[] => {
    if (effectiveFilter === PROVIDER_FILTER_ALL) {
      return models;
    }
    return models.filter((model): boolean => model.providerId === effectiveFilter);
  }, [models, effectiveFilter]);

  const filteredModels = React.useMemo((): LlmModel[] => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) {
      return filteredByProvider;
    }
    return filteredByProvider.filter(
      (model): boolean =>
        model.name.toLowerCase().includes(trimmed) || model.modelId.toLowerCase().includes(trimmed),
    );
  }, [filteredByProvider, query]);

  const filterOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] => [
      { value: PROVIDER_FILTER_ALL, label: translate('llmModels.allProviders') },
      ...providers.map(
        (provider): ComboboxOption => ({ value: provider.id, label: provider.name }),
      ),
    ],
    [providers],
  );

  const providerFilterCombobox = (
    <div className="w-[200px]">
      <Combobox
        options={filterOptions}
        value={effectiveFilter}
        onChange={setProviderFilter}
        placeholder={translate('llmModels.allProviders')}
        searchPlaceholder={translate('agents.searchProviders')}
        emptyMessage={translate('agents.noProviders')}
        size="sm"
      />
    </div>
  );

  const handleAdd = (): void => {
    onAddLlmModel();
  };

  const handleEdit = (id: string): void => {
    onEditLlmModel(id);
  };

  const handleDelete = (model: LlmModel): void => {
    onDeleteLlmModel(model);
  };

  const isRefreshing = isFetching && !isLoading;

  return (
    <div className="h-full flex flex-col">
      <SectionHeader
        title={translate('llmModels.title')}
        search={{
          value: query,
          onChange: setQuery,
          placeholder: translate('llmModels.searchPlaceholder'),
        }}
        filter={providerFilterCombobox}
        onRefresh={handleRefetch}
        isRefreshing={isRefreshing}
        onAdd={handleAdd}
        addLabel={translate('llmModels.addModel')}
      />
      <SectionBody
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        onRetry={handleRefetch}
      >
        <LlmModelsList
          models={models}
          filteredByProvider={filteredByProvider}
          filteredModels={filteredModels}
          query={query}
          providersById={providersById}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </SectionBody>
    </div>
  );
};
