import * as React from 'react';

import type { Provider } from '@/features/providers/types/provider';
import { ProvidersManagementView } from '@/features/providers/views/providers-management-view';
import { openCreateProviderDialog } from '@/windows/settings-window/actions/open-create-provider-dialog';
import { openDeleteProviderDialog } from '@/windows/settings-window/actions/open-delete-provider-dialog';
import { openEditProviderDialog } from '@/windows/settings-window/actions/open-edit-provider-dialog';

export const ProvidersView = (): React.ReactElement => {
  return (
    <ProvidersManagementView
      onAddProvider={openCreateProviderDialog}
      onEditProvider={openEditProviderDialog}
      onDeleteProvider={(provider: Provider): void => {
        openDeleteProviderDialog(provider.id);
      }}
    />
  );
};
