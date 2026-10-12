import * as React from 'react';

import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { X } from 'lucide-react';

import { BRICK_KIND_LABEL_KEY } from '@/features/bricks/constants/brick-kind-label-key';
import { BRICK_KIND_OPTIONS } from '@/features/bricks/constants/brick-kind-options';
import { buildBrickConfig } from '@/features/bricks/lib/build-brick-config';
import { useSaveBrick } from '@/features/bricks/queries/use-save-brick';
import type { Brick } from '@/features/bricks/types/brick';
import { BrickConfigType } from '@/features/bricks/types/brick-config-type';
import { BrickConfigUiMovePointerCoordinateSpace } from '@/features/bricks/types/brick-config-ui-move-pointer-coordinate-space';
import { BrickConfigUiMovePointerGeometry } from '@/features/bricks/types/brick-config-ui-move-pointer-geometry';
import type { BrickInput } from '@/features/bricks/types/brick-input';
import { BrickFormCustomFields } from '@/features/bricks/views/brick-form-custom-fields';
import { BrickFormUiFields } from '@/features/bricks/views/brick-form-ui-fields';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import type { Provider } from '@/features/providers/types/provider';
import { toastError } from '@/features/toasts/actions/toast-error';
import { useFieldErrors } from '@/shared/hooks/use-field-errors';
import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';
import { validateTrimmedNonEmpty } from '@/shared/lib/validate-trimmed-non-empty';
import { FormMode } from '@/shared/types/form-mode';
import { Button } from '@/shared/views/button';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogForm } from '@/shared/views/dialog-form';
import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { KindPicker } from '@/shared/views/kind-picker';
import { Label } from '@/shared/views/label';
import { SubmitButtonContent } from '@/shared/views/submit-button-content';

interface BrickFormProps {
  mode: FormMode;
  brick: Brick | null;
  providers: Provider[];
  llmModels: LlmModel[];
  onClose: () => void;
}

interface BrickFormValues {
  name: string;
  kind: BrickConfigType | null;
  providerId: string;
  movePointerLlmModelId: string;
  customPath: string;
}

function validateFormValues(values: BrickFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.kind === null) {
    errors['kind'] = translate('bricks.pathRequired');
  }
  const nameError = validateTrimmedNonEmpty(values.name);
  if (nameError !== null) {
    errors['name'] = nameError;
  }
  if (values.kind === BrickConfigType.Ui) {
    if (values.providerId.length === 0) {
      errors['providerId'] = translate('llmModels.pickProvider');
    }
    if (values.movePointerLlmModelId.length === 0) {
      errors['movePointerLlmModelId'] = translate('bricks.pickLlmModel');
    }
  }
  if (values.kind === BrickConfigType.Custom) {
    const pathError = validateTrimmedNonEmpty(values.customPath, translate('bricks.pathRequired'));
    if (pathError !== null) {
      errors['customPath'] = pathError;
    }
  }
  return errors;
}

export const BrickForm = ({
  mode,
  brick,
  providers,
  llmModels,
  onClose,
}: BrickFormProps): React.ReactElement => {
  const save = useSaveBrick();

  const [snapshotBrick] = React.useState(brick);
  const [providersSnapshot] = React.useState(providers);
  const [llmModelsSnapshot] = React.useState(llmModels);

  const initialKind: BrickConfigType | null = snapshotBrick?.config.type ?? null;
  const initialMovePointerLlmModelId =
    snapshotBrick?.config.type === BrickConfigType.Ui
      ? snapshotBrick.config.movePointerLlmModelId
      : '';
  const initialMovePointerModel = llmModelsSnapshot.find(
    (model): boolean => model.id === initialMovePointerLlmModelId,
  );

  const [name, setName] = React.useState((): string => snapshotBrick?.name ?? '');
  const [kind, setKindRaw] = React.useState<BrickConfigType | null>(initialKind);
  const [movePointerLlmModelId, setMovePointerLlmModelId] = React.useState(
    initialMovePointerLlmModelId,
  );
  const [movePointerGeometry, setMovePointerGeometry] =
    React.useState<BrickConfigUiMovePointerGeometry>(
      (): BrickConfigUiMovePointerGeometry =>
        snapshotBrick?.config.type === BrickConfigType.Ui
          ? snapshotBrick.config.movePointerGeometry
          : BrickConfigUiMovePointerGeometry.Point,
    );
  const [movePointerCoordinateSpace, setMovePointerCoordinateSpace] =
    React.useState<BrickConfigUiMovePointerCoordinateSpace>(
      (): BrickConfigUiMovePointerCoordinateSpace =>
        snapshotBrick?.config.type === BrickConfigType.Ui
          ? snapshotBrick.config.movePointerCoordinateSpace
          : BrickConfigUiMovePointerCoordinateSpace.Pixels,
    );
  const [customPath, setCustomPath] = React.useState((): string =>
    snapshotBrick?.config.type === BrickConfigType.Custom ? snapshotBrick.config.path : '',
  );
  const [providerId, setProviderId] = React.useState<string>(
    (): string => initialMovePointerModel?.providerId ?? '',
  );

  const setKind = (next: BrickConfigType): void => {
    const previousLabel = kind !== null ? translate(BRICK_KIND_LABEL_KEY[kind]) : null;
    setKindRaw(next);
    const trimmed = trimSpaces(name);
    if (trimmed.length === 0 || (previousLabel !== null && trimmed === previousLabel)) {
      setName(translate(BRICK_KIND_LABEL_KEY[next]));
    }
  };

  const formValues: BrickFormValues = {
    name,
    kind,
    providerId,
    movePointerLlmModelId,
    customPath,
  };

  const validate = React.useCallback(
    (values: BrickFormValues): Record<string, string> => validateFormValues(values),
    [],
  );

  const fieldErrors = useFieldErrors(formValues, validate);

  const pickBrickPath = async (): Promise<void> => {
    try {
      const picked = await openDialog({ directory: true, multiple: false });
      if (typeof picked !== 'string') {
        return;
      }
      setCustomPath(picked);
      fieldErrors.touch('customPath');
    } catch (caught) {
      toastError(caught);
    }
  };

  const submit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || save.isPending) {
      return;
    }
    if (kind === null) {
      return;
    }
    const config = buildBrickConfig({
      kind,
      movePointerLlmModelId,
      movePointerGeometry,
      movePointerCoordinateSpace,
      trimmedCustomPath: trimSpaces(customPath),
    });
    const input: BrickInput = { name: trimSpaces(name), config };
    try {
      await save.mutateAsync({ input, id: snapshotBrick?.id ?? null });
      onClose();
    } catch (caught) {
      toastError(caught);
    }
  };

  const isPending = save.isPending;
  const isEditing = mode === FormMode.Edit;

  return (
    <DialogForm
      onSubmit={(event): void => {
        void submit(event);
      }}
    >
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{translate('bricks.typeLabel')}</Label>
            <KindPicker
              options={BRICK_KIND_OPTIONS}
              value={kind}
              onChange={(value): void => {
                setKind(value);
                fieldErrors.touch('kind');
              }}
              disabled={isEditing || isPending}
              columns={2}
            />
            <FieldError message={fieldErrors.errorFor('kind')} />
            {isEditing ? (
              <div className="text-[11px] text-muted">{translate('bricks.typeCannotChange')}</div>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="brick-name">{translate('bricks.nameLabel')}</Label>
            <Input
              id="brick-name"
              value={name}
              onChange={(event): void => {
                setName(event.target.value);
              }}
              onBlur={(): void => {
                fieldErrors.touch('name');
              }}
              isInvalid={Boolean(fieldErrors.errorFor('name'))}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('name')} />
          </div>
          {kind === BrickConfigType.Ui ? (
            <BrickFormUiFields
              providers={providersSnapshot}
              llmModels={llmModelsSnapshot}
              providerId={providerId}
              movePointerLlmModelId={movePointerLlmModelId}
              movePointerGeometry={movePointerGeometry}
              movePointerCoordinateSpace={movePointerCoordinateSpace}
              providerError={fieldErrors.errorFor('providerId')}
              movePointerLlmModelError={fieldErrors.errorFor('movePointerLlmModelId')}
              isPending={isPending}
              onProviderChange={(nextProviderId): void => {
                setProviderId(nextProviderId);
                setMovePointerLlmModelId('');
                fieldErrors.touch('providerId');
              }}
              onMovePointerLlmModelChange={(llmModelId): void => {
                setMovePointerLlmModelId(llmModelId);
                fieldErrors.touch('movePointerLlmModelId');
              }}
              onMovePointerGeometryChange={setMovePointerGeometry}
              onMovePointerCoordinateSpaceChange={setMovePointerCoordinateSpace}
            />
          ) : null}
          {kind === BrickConfigType.Custom ? (
            <BrickFormCustomFields
              customPath={customPath}
              customPathError={fieldErrors.errorFor('customPath')}
              isPending={isPending}
              onPickPath={(): void => {
                void pickBrickPath();
              }}
            />
          ) : null}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          <X size={13} />
          {translate('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          <SubmitButtonContent isPending={isPending} mode={mode} />
          {isEditing ? translate('common.saveChanges') : translate('bricks.addBrick')}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
};
