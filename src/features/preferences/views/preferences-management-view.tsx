import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { preferenceQueryKeys } from '@/features/preferences/queries/preference-query-keys';
import { usePreferences } from '@/features/preferences/queries/use-preferences';
import { PreferencesForm } from '@/features/preferences/views/preferences-form';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

export const PreferencesManagementView = (): React.ReactElement => {
  const queryClient = useQueryClient();
  const preferencesQuery = usePreferences();
  const [mountKey, setMountKey] = React.useState(0);

  const refresh = React.useCallback((): void => {
    void queryClient.invalidateQueries({ queryKey: preferenceQueryKeys.list });
    setMountKey((current): number => current + 1);
  }, [queryClient]);

  return (
    <div className="h-full flex flex-col">
      <FormBootstrap queries={[preferencesQuery]}>
        <PreferencesForm
          key={mountKey}
          preferences={preferencesQuery.data ?? []}
          onRefresh={refresh}
          isRefreshing={preferencesQuery.isFetching}
        />
      </FormBootstrap>
    </div>
  );
};
