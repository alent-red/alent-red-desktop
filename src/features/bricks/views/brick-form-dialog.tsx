import * as React from 'react';

import { useBrick } from '@/features/bricks/queries/use-brick';
import { BrickForm } from '@/features/bricks/views/brick-form';
import { useLlmModels } from '@/features/llm-models/queries/use-llm-models';
import { useProviders } from '@/features/providers/queries/use-providers';
import { translate } from '@/shared/i18n/translate';
import { FormMode } from '@/shared/types/form-mode';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

interface BrickFormDialogProps {
  mode: FormMode;
  brickId: string | null;
  onClose: () => void;
}

export const BrickFormDialog = ({
  mode,
  brickId,
  onClose,
}: BrickFormDialogProps): React.ReactElement => {
  const providersQuery = useProviders();
  const llmModelsQuery = useLlmModels(null);
  const brickQuery = useBrick(mode === FormMode.Edit ? brickId : undefined);
  const bootstrapQueries =
    mode === FormMode.Edit
      ? [providersQuery, llmModelsQuery, brickQuery]
      : [providersQuery, llmModelsQuery];
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
              ? translate('bricks.addBrickTitle')
              : translate('bricks.editBrickTitle')}
          </DialogTitle>
        </DialogHeader>
        <FormBootstrap queries={bootstrapQueries} loadingClassName="min-h-[260px]">
          <BrickForm
            mode={mode}
            brick={brickQuery.data ?? null}
            providers={providersQuery.data ?? []}
            llmModels={llmModelsQuery.data ?? []}
            onClose={onClose}
          />
        </FormBootstrap>
      </DialogContent>
    </Dialog>
  );
};
