import * as React from 'react';

import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { LlmModelForm } from '@/features/llm-models/views/llm-model-form';
import { useProviders } from '@/features/providers/queries/use-providers';
import { translate } from '@/shared/i18n/translate';
import { FormMode } from '@/shared/types/form-mode';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

interface FirstModelStepProps {
  providerId: string;
  onSaved: (model: LlmModel) => void;
}

export const FirstModelStep = ({
  providerId,
  onSaved,
}: FirstModelStepProps): React.ReactElement => {
  const providersQuery = useProviders();
  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-[18px] font-semibold tracking-tight text-primary">
          {translate('onboarding.firstModelTitle')}
        </div>
        <div className="text-[13.5px] leading-[1.6] text-secondary">
          {translate('onboarding.firstModelBody')}
        </div>
      </div>
      <div className="rounded-[12px] border border-default bg-[var(--bg-surface-raised)] overflow-hidden">
        <FormBootstrap queries={[providersQuery]} loadingClassName="min-h-[320px]">
          <LlmModelForm
            mode={FormMode.Create}
            model={null}
            providers={providersQuery.data ?? []}
            onClose={(): void => {
              // Onboarding owns "what happens next" via onSaved.
            }}
            onSaved={onSaved}
            hideCancel
            lockedProviderId={providerId}
          />
        </FormBootstrap>
      </div>
    </div>
  );
};
