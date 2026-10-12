import * as React from 'react';

import { usePreferences } from '@/features/preferences/queries/use-preferences';
import type { Provider } from '@/features/providers/types/provider';
import { ProviderForm } from '@/features/providers/views/provider-form';
import { translate } from '@/shared/i18n/translate';
import { FormMode } from '@/shared/types/form-mode';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

interface ProviderStepProps {
  onSaved: (provider: Provider) => void;
}

export const ProviderStep = ({ onSaved }: ProviderStepProps): React.ReactElement => {
  const preferencesQuery = usePreferences();
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[18px] font-semibold tracking-tight text-primary">
          {translate('onboarding.providerTitle')}
        </div>
        <div className="text-[13.5px] leading-[1.6] text-secondary">
          {translate('onboarding.providerBody')}
        </div>
      </div>
      <div className="rounded-[12px] border border-default bg-[var(--bg-surface-raised)] overflow-hidden">
        <FormBootstrap queries={[preferencesQuery]} loadingClassName="min-h-[300px]">
          <ProviderForm
            mode={FormMode.Create}
            provider={null}
            preferences={preferencesQuery.data ?? []}
            onClose={(): void => {
              // Onboarding owns "what happens next" via onSaved.
            }}
            onSaved={onSaved}
            hideCancel
            hideName
            hideAutoAddLlmModels
          />
        </FormBootstrap>
      </div>
    </div>
  );
};
