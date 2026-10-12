import * as React from 'react';

import { X } from 'lucide-react';

import { LLM_MODEL_CACHE_OPTIONS } from '@/features/llm-models/constants/llm-model-cache-options';
import { LLM_MODEL_IMAGE_DETAIL_OPTIONS } from '@/features/llm-models/constants/llm-model-image-detail-options';
import { computeModelIdFromName } from '@/features/llm-models/lib/compute-model-id-from-name';
import { computeNameFromModelId } from '@/features/llm-models/lib/compute-name-from-model-id';
import { useSaveLlmModel } from '@/features/llm-models/queries/use-save-llm-model';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { LlmModelCache } from '@/features/llm-models/types/llm-model-cache';
import { LlmModelImageDetail } from '@/features/llm-models/types/llm-model-image-detail';
import type { LlmModelInput } from '@/features/llm-models/types/llm-model-input';
import type { Provider } from '@/features/providers/types/provider';
import { toastError } from '@/features/toasts/actions/toast-error';
import { useFieldErrors } from '@/shared/hooks/use-field-errors';
import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';
import { validatePositiveInt } from '@/shared/lib/validate-positive-int';
import { validateProbability } from '@/shared/lib/validate-probability';
import { validateTrimmedNonEmpty } from '@/shared/lib/validate-trimmed-non-empty';
import { FormMode } from '@/shared/types/form-mode';
import { Button } from '@/shared/views/button';
import { Combobox, type ComboboxOption } from '@/shared/views/combobox';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogForm } from '@/shared/views/dialog-form';
import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { Label } from '@/shared/views/label';
import { Select } from '@/shared/views/select';
import { SelectContent } from '@/shared/views/select-content';
import { SelectItem } from '@/shared/views/select-item';
import { SelectTrigger } from '@/shared/views/select-trigger';
import { SelectValue } from '@/shared/views/select-value';
import { SubmitButtonContent } from '@/shared/views/submit-button-content';

interface LlmModelFormProps {
  mode: FormMode;
  model: LlmModel | null;
  providers: Provider[];
  onClose: () => void;
  onSaved?: (model: LlmModel) => void;
  hideCancel?: boolean;
  lockedProviderId?: string;
}

interface LlmModelFormValues {
  providerId: string;
  name: string;
  modelId: string;
  contextWindowTokensCount: number | '';
  maxOutputTokensCount: number | '';
  topP: number | '';
}

const MAX_OUTPUT_FRACTION_OF_CONTEXT = 0.05;
const DEFAULT_TOP_P = 0.7;

function validateFormValues(values: LlmModelFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.providerId.length === 0) {
    errors['providerId'] = translate('llmModels.pickProvider');
  }
  const nameError = validateTrimmedNonEmpty(values.name);
  if (nameError !== null) {
    errors['name'] = nameError;
  }
  const modelIdError = validateTrimmedNonEmpty(
    values.modelId,
    translate('llmModels.modelIdRequired'),
  );
  if (modelIdError !== null) {
    errors['modelId'] = modelIdError;
  }
  if (values.contextWindowTokensCount === '') {
    errors['contextWindowTokensCount'] = translate('validation.required');
  } else {
    const contextWindowError = validatePositiveInt(values.contextWindowTokensCount);
    if (contextWindowError !== null) {
      errors['contextWindowTokensCount'] = contextWindowError;
    }
  }
  if (values.maxOutputTokensCount === '') {
    errors['maxOutputTokensCount'] = translate('validation.required');
  } else {
    const maxOutputError = validatePositiveInt(values.maxOutputTokensCount);
    if (maxOutputError !== null) {
      errors['maxOutputTokensCount'] = maxOutputError;
    }
  }
  if (values.topP === '') {
    errors['topP'] = translate('validation.required');
  } else {
    const topPError = validateProbability(values.topP);
    if (topPError !== null) {
      errors['topP'] = topPError;
    }
  }
  return errors;
}

export const LlmModelForm = ({
  mode,
  model,
  providers,
  onClose,
  onSaved,
  hideCancel = false,
  lockedProviderId,
}: LlmModelFormProps): React.ReactElement => {
  const save = useSaveLlmModel();

  const [snapshotModel] = React.useState(model);
  const [providersSnapshot] = React.useState(providers);
  const [snapshotLockedProviderId] = React.useState(lockedProviderId);

  const [providerId, setProviderId] = React.useState(
    (): string => snapshotModel?.providerId ?? snapshotLockedProviderId ?? '',
  );
  const [name, setName] = React.useState((): string => snapshotModel?.name ?? '');
  const [modelIdValue, setModelIdValue] = React.useState(
    (): string => snapshotModel?.modelId ?? '',
  );
  const [contextWindowTokensCount, setContextWindowTokensCount] = React.useState<number | ''>(
    (): number | '' => snapshotModel?.contextWindowTokensCount ?? '',
  );
  const [maxOutputTokensCount, setMaxOutputTokensCount] = React.useState<number | ''>(
    (): number | '' => snapshotModel?.maxOutputTokensCount ?? '',
  );
  const lastAutoFilledNameRef = React.useRef<string | null>(null);
  const lastAutoFilledModelIdRef = React.useRef<string | null>(null);
  const [topP, setTopP] = React.useState<number | ''>(
    (): number | '' => snapshotModel?.topP ?? DEFAULT_TOP_P,
  );
  const [imageDetail, setImageDetail] = React.useState<LlmModelImageDetail>(
    (): LlmModelImageDetail => snapshotModel?.imageDetail ?? LlmModelImageDetail.High,
  );
  const [cache, setCache] = React.useState<LlmModelCache>(
    (): LlmModelCache => snapshotModel?.cache ?? LlmModelCache.Medium,
  );

  const providerOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] =>
      providersSnapshot.map(
        (provider): ComboboxOption => ({ value: provider.id, label: provider.name }),
      ),
    [providersSnapshot],
  );

  const formValues: LlmModelFormValues = {
    providerId,
    name,
    modelId: modelIdValue,
    contextWindowTokensCount,
    maxOutputTokensCount,
    topP,
  };

  const validate = React.useCallback(
    (values: LlmModelFormValues): Record<string, string> => validateFormValues(values),
    [],
  );

  const fieldErrors = useFieldErrors(formValues, validate);

  const submit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || save.isPending) {
      return;
    }
    if (contextWindowTokensCount === '' || maxOutputTokensCount === '' || topP === '') {
      return;
    }
    const input: LlmModelInput = {
      name: trimSpaces(name),
      modelId: trimSpaces(modelIdValue),
      contextWindowTokensCount,
      maxOutputTokensCount,
      topP,
      imageDetail,
      cache,
      providerId,
    };
    try {
      const saved = await save.mutateAsync({ input, id: snapshotModel?.id ?? null });
      onSaved?.(saved);
      onClose();
    } catch (caught) {
      toastError(caught);
    }
  };

  const handleNameBlur = (): void => {
    fieldErrors.touch('name');
    const trimmedName = trimSpaces(name);
    if (trimmedName.length === 0) {
      return;
    }
    const currentModelId = trimSpaces(modelIdValue);
    const canOverwrite =
      currentModelId.length === 0 || currentModelId === lastAutoFilledModelIdRef.current;
    if (!canOverwrite) {
      return;
    }
    const computed = computeModelIdFromName(trimmedName);
    setModelIdValue(computed);
    lastAutoFilledModelIdRef.current = computed;
  };

  const handleModelIdBlur = (): void => {
    fieldErrors.touch('modelId');
    const trimmedModelId = trimSpaces(modelIdValue);
    if (trimmedModelId.length === 0) {
      return;
    }
    const currentName = trimSpaces(name);
    const canOverwrite = currentName.length === 0 || currentName === lastAutoFilledNameRef.current;
    if (!canOverwrite) {
      return;
    }
    const computed = computeNameFromModelId(trimmedModelId);
    setName(computed);
    lastAutoFilledNameRef.current = computed;
  };

  const handleContextWindowBlur = (): void => {
    fieldErrors.touch('contextWindowTokensCount');
    if (
      contextWindowTokensCount !== '' &&
      Number.isFinite(contextWindowTokensCount) &&
      contextWindowTokensCount > 0
    ) {
      setMaxOutputTokensCount(
        Math.round(contextWindowTokensCount * MAX_OUTPUT_FRACTION_OF_CONTEXT),
      );
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
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 col-span-2">
            <Label>{translate('llmModels.providerLabel')}</Label>
            <Combobox
              options={providerOptions}
              value={providerId}
              onChange={(value): void => {
                setProviderId(value);
                fieldErrors.touch('providerId');
              }}
              placeholder={translate('agents.providerPlaceholder')}
              searchPlaceholder={translate('agents.searchProviders')}
              emptyMessage={translate('agents.noProviders')}
              isInvalid={Boolean(fieldErrors.errorFor('providerId'))}
              disabled={isPending || snapshotLockedProviderId !== undefined}
            />
            <FieldError message={fieldErrors.errorFor('providerId')} />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <Label htmlFor="model-name">{translate('llmModels.nameLabel')}</Label>
            <Input
              id="model-name"
              value={name}
              onChange={(event): void => {
                setName(event.target.value);
              }}
              onBlur={handleNameBlur}
              isInvalid={Boolean(fieldErrors.errorFor('name'))}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('name')} />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <Label htmlFor="model-id">{translate('llmModels.modelIdLabel')}</Label>
            <Input
              id="model-id"
              value={modelIdValue}
              onChange={(event): void => {
                setModelIdValue(event.target.value);
              }}
              onBlur={handleModelIdBlur}
              isInvalid={Boolean(fieldErrors.errorFor('modelId'))}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('modelId')} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="model-context-window-tokens-count">
              {translate('llmModels.contextWindowLabel')}
            </Label>
            <Input
              id="model-context-window-tokens-count"
              type="number"
              value={contextWindowTokensCount === '' ? '' : String(contextWindowTokensCount)}
              onChange={(event): void => {
                const raw = event.target.value;
                setContextWindowTokensCount(raw === '' ? '' : Number(raw));
              }}
              onBlur={handleContextWindowBlur}
              isInvalid={Boolean(fieldErrors.errorFor('contextWindowTokensCount'))}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('contextWindowTokensCount')} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="model-max-output-tokens-count">
              {translate('llmModels.maxOutputLabel')}
            </Label>
            <Input
              id="model-max-output-tokens-count"
              type="number"
              value={maxOutputTokensCount === '' ? '' : String(maxOutputTokensCount)}
              onChange={(event): void => {
                const raw = event.target.value;
                setMaxOutputTokensCount(raw === '' ? '' : Number(raw));
              }}
              onBlur={(): void => {
                fieldErrors.touch('maxOutputTokensCount');
              }}
              isInvalid={Boolean(fieldErrors.errorFor('maxOutputTokensCount'))}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('maxOutputTokensCount')} />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="model-top-p">{translate('llmModels.topPLabel')}</Label>
            <Input
              id="model-top-p"
              type="number"
              step="0.01"
              value={topP === '' ? '' : String(topP)}
              onChange={(event): void => {
                const raw = event.target.value;
                setTopP(raw === '' ? '' : Number(raw));
              }}
              onBlur={(): void => {
                fieldErrors.touch('topP');
              }}
              isInvalid={Boolean(fieldErrors.errorFor('topP'))}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('topP')} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>{translate('llmModels.imageDetailLabel')}</Label>
            <Select
              value={imageDetail}
              onValueChange={(value): void => {
                setImageDetail(value as LlmModelImageDetail);
              }}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_MODEL_IMAGE_DETAIL_OPTIONS.map(
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
            <Label>{translate('llmModels.cacheLabel')}</Label>
            <Select
              value={cache}
              onValueChange={(value): void => {
                setCache(value as LlmModelCache);
              }}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LLM_MODEL_CACHE_OPTIONS.map(
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
      </DialogBody>
      <DialogFooter className={hideCancel ? 'justify-center' : undefined}>
        {hideCancel ? null : (
          <Button type="button" variant="ghost" onClick={onClose}>
            <X size={13} />
            {translate('common.cancel')}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isPending}>
          <SubmitButtonContent isPending={isPending} mode={mode} />
          {isEditing ? translate('common.saveChanges') : translate('llmModels.addModel')}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
};
