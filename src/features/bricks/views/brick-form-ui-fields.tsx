import * as React from 'react';

import { MOVE_POINTER_COORDINATE_SPACE_OPTIONS } from '@/features/bricks/constants/move-pointer-coordinate-space-options';
import { MOVE_POINTER_GEOMETRY_OPTIONS } from '@/features/bricks/constants/move-pointer-geometry-options';
import type { BrickConfigUiMovePointerCoordinateSpace } from '@/features/bricks/types/brick-config-ui-move-pointer-coordinate-space';
import type { BrickConfigUiMovePointerGeometry } from '@/features/bricks/types/brick-config-ui-move-pointer-geometry';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import type { Provider } from '@/features/providers/types/provider';
import { translate } from '@/shared/i18n/translate';
import { Combobox, type ComboboxOption } from '@/shared/views/combobox';
import { FieldError } from '@/shared/views/field-error';
import { Label } from '@/shared/views/label';
import { Select } from '@/shared/views/select';
import { SelectContent } from '@/shared/views/select-content';
import { SelectItem } from '@/shared/views/select-item';
import { SelectTrigger } from '@/shared/views/select-trigger';
import { SelectValue } from '@/shared/views/select-value';

interface BrickFormUiFieldsProps {
  providers: Provider[];
  llmModels: LlmModel[];
  providerId: string;
  movePointerLlmModelId: string;
  movePointerGeometry: BrickConfigUiMovePointerGeometry;
  movePointerCoordinateSpace: BrickConfigUiMovePointerCoordinateSpace;
  providerError: string | null;
  movePointerLlmModelError: string | null;
  isPending: boolean;
  onProviderChange: (providerId: string) => void;
  onMovePointerLlmModelChange: (llmModelId: string) => void;
  onMovePointerGeometryChange: (geometry: BrickConfigUiMovePointerGeometry) => void;
  onMovePointerCoordinateSpaceChange: (
    coordinateSpace: BrickConfigUiMovePointerCoordinateSpace,
  ) => void;
}

export const BrickFormUiFields = ({
  providers,
  llmModels,
  providerId,
  movePointerLlmModelId,
  movePointerGeometry,
  movePointerCoordinateSpace,
  providerError,
  movePointerLlmModelError,
  isPending,
  onProviderChange,
  onMovePointerLlmModelChange,
  onMovePointerGeometryChange,
  onMovePointerCoordinateSpaceChange,
}: BrickFormUiFieldsProps): React.ReactElement => {
  const providerOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] =>
      providers.map((provider): ComboboxOption => ({ value: provider.id, label: provider.name })),
    [providers],
  );

  const modelOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] =>
      llmModels
        .filter((model): boolean => model.providerId === providerId)
        .map((model): ComboboxOption => ({ value: model.id, label: model.name })),
    [llmModels, providerId],
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>{translate('bricks.movePointerProviderLabel')}</Label>
          <Combobox
            options={providerOptions}
            value={providerId}
            onChange={onProviderChange}
            placeholder={translate('bricks.chooseProvider')}
            searchPlaceholder={translate('agents.searchProviders')}
            emptyMessage={translate('agents.noProviders')}
            isInvalid={Boolean(providerError)}
            disabled={isPending}
          />
          <FieldError message={providerError} />
        </div>
        <div className="flex flex-col gap-1">
          <Label>{translate('bricks.movePointerModelLabel')}</Label>
          <Combobox
            options={modelOptions}
            value={movePointerLlmModelId}
            onChange={onMovePointerLlmModelChange}
            placeholder={translate('bricks.chooseModel')}
            searchPlaceholder={translate('agents.searchModels')}
            emptyMessage={translate('agents.noModels')}
            disabled={providerId.length === 0 || isPending}
            isInvalid={Boolean(movePointerLlmModelError)}
          />
          <FieldError message={movePointerLlmModelError} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label>{translate('bricks.movePointerGeometryLabel')}</Label>
          <Select
            value={movePointerGeometry}
            onValueChange={(value): void => {
              onMovePointerGeometryChange(value as BrickConfigUiMovePointerGeometry);
            }}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOVE_POINTER_GEOMETRY_OPTIONS.map(
                (option): React.ReactElement => (
                  <SelectItem key={option.value} value={option.value}>
                    {translate(option.labelKey)}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label>{translate('bricks.movePointerCoordinateSpaceLabel')}</Label>
          <Select
            value={movePointerCoordinateSpace}
            onValueChange={(value): void => {
              onMovePointerCoordinateSpaceChange(value as BrickConfigUiMovePointerCoordinateSpace);
            }}
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MOVE_POINTER_COORDINATE_SPACE_OPTIONS.map(
                (option): React.ReactElement => (
                  <SelectItem key={option.value} value={option.value}>
                    {translate(option.labelKey)}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
