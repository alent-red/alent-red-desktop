import * as React from 'react';

import { BrickFormDialog } from '@/features/bricks/views/brick-form-dialog';
import { DeleteBrickDialog } from '@/features/bricks/views/delete-brick-dialog';
import { DeleteLlmModelDialog } from '@/features/llm-models/views/delete-llm-model-dialog';
import { LlmModelFormDialog } from '@/features/llm-models/views/llm-model-form-dialog';
import { DeleteProviderDialog } from '@/features/providers/views/delete-provider-dialog';
import { ProviderFormDialog } from '@/features/providers/views/provider-form-dialog';
import { assertNever } from '@/shared/lib/assert-never';
import { FormMode } from '@/shared/types/form-mode';
import { closeSettingsWindowDialog } from '@/windows/settings-window/actions/close-settings-window-dialog';
import {
  useSettingsWindowDialogsStore,
  type SettingsWindowDialogsState,
} from '@/windows/settings-window/stores/settings-window-dialogs-store';
import { SettingsWindowDialogType } from '@/windows/settings-window/types/settings-window-dialog-type';

export const SettingsWindowDialogs = (): React.ReactElement | null => {
  const dialog = useSettingsWindowDialogsStore(
    (state: SettingsWindowDialogsState): SettingsWindowDialogsState['dialog'] => state.dialog,
  );

  switch (dialog.type) {
    case SettingsWindowDialogType.None:
      return null;
    case SettingsWindowDialogType.CreateProvider:
      return (
        <ProviderFormDialog
          mode={FormMode.Create}
          providerId={null}
          onClose={closeSettingsWindowDialog}
        />
      );
    case SettingsWindowDialogType.EditProvider:
      return (
        <ProviderFormDialog
          mode={FormMode.Edit}
          providerId={dialog.providerId}
          onClose={closeSettingsWindowDialog}
        />
      );
    case SettingsWindowDialogType.DeleteProvider:
      return (
        <DeleteProviderDialog providerId={dialog.providerId} onClose={closeSettingsWindowDialog} />
      );
    case SettingsWindowDialogType.CreateLlmModel:
      return (
        <LlmModelFormDialog
          mode={FormMode.Create}
          modelId={null}
          onClose={closeSettingsWindowDialog}
        />
      );
    case SettingsWindowDialogType.EditLlmModel:
      return (
        <LlmModelFormDialog
          mode={FormMode.Edit}
          modelId={dialog.llmModelId}
          onClose={closeSettingsWindowDialog}
        />
      );
    case SettingsWindowDialogType.DeleteLlmModel:
      return (
        <DeleteLlmModelDialog llmModelId={dialog.llmModelId} onClose={closeSettingsWindowDialog} />
      );
    case SettingsWindowDialogType.CreateBrick:
      return (
        <BrickFormDialog
          mode={FormMode.Create}
          brickId={null}
          onClose={closeSettingsWindowDialog}
        />
      );
    case SettingsWindowDialogType.EditBrick:
      return (
        <BrickFormDialog
          mode={FormMode.Edit}
          brickId={dialog.brickId}
          onClose={closeSettingsWindowDialog}
        />
      );
    case SettingsWindowDialogType.DeleteBrick:
      return <DeleteBrickDialog brickId={dialog.brickId} onClose={closeSettingsWindowDialog} />;
    default:
      return assertNever(dialog);
  }
};
