import * as React from 'react';

import { usePreferences } from '@/features/preferences/queries/use-preferences';
import { useProvider } from '@/features/providers/queries/use-provider';
import { ProviderForm } from '@/features/providers/views/provider-form';
import { translate } from '@/shared/i18n/translate';
import { FormMode } from '@/shared/types/form-mode';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

interface ProviderFormDialogProps {
  mode: FormMode;
  providerId: string | null;
  onClose: () => void;
}

export const ProviderFormDialog = ({
  mode,
  providerId,
  onClose,
}: ProviderFormDialogProps): React.ReactElement => {
  const preferencesQuery = usePreferences();
  const providerQuery = useProvider(mode === FormMode.Edit ? providerId : undefined);
  const bootstrapQueries =
    mode === FormMode.Edit ? [preferencesQuery, providerQuery] : [preferencesQuery];
  return (
    <Dialog
      open
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>
            {mode === FormMode.Create
              ? translate('providers.addProviderTitle')
              : translate('providers.editProviderTitle')}
          </DialogTitle>
        </DialogHeader>
        <FormBootstrap queries={bootstrapQueries} loadingClassName="min-h-[260px]">
          <ProviderForm
            mode={mode}
            provider={providerQuery.data ?? null}
            preferences={preferencesQuery.data ?? []}
            onClose={onClose}
          />
        </FormBootstrap>
      </DialogContent>
    </Dialog>
  );
};
