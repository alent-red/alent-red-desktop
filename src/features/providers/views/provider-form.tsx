import * as React from 'react';

import { X } from 'lucide-react';

import { isAutoAddSupportedProviderType } from '@/features/llm-models/lib/is-auto-add-supported-provider-type';
import { runAutoAddLlmModelsForProvider } from '@/features/llm-models/lib/run-auto-add-llm-models-for-provider';
import { useSaveLlmModel } from '@/features/llm-models/queries/use-save-llm-model';
import { readCacheTtlPreference } from '@/features/preferences/lib/read-cache-ttl-preference';
import { readIntPreference } from '@/features/preferences/lib/read-int-preference';
import type { Preference } from '@/features/preferences/types/preference';
import { PreferenceKey } from '@/features/preferences/types/preference-key';
import { LM_STUDIO_DEFAULT_BASE_URL } from '@/features/providers/constants/lm-studio-default-base-url';
import { PROVIDER_API_FORMAT_OPTIONS } from '@/features/providers/constants/provider-api-format-options';
import { PROVIDER_KIND_LABEL_KEY } from '@/features/providers/constants/provider-kind-label-key';
import { PROVIDER_KIND_OPTIONS } from '@/features/providers/constants/provider-kind-options';
import { buildProviderApiFormat } from '@/features/providers/lib/build-provider-api-format';
import { buildProviderConfig } from '@/features/providers/lib/build-provider-config';
import { initialApiKeyFromProvider } from '@/features/providers/lib/initial-api-key-from-provider';
import { initialBaseUrlFromProvider } from '@/features/providers/lib/initial-base-url-from-provider';
import { useSaveProvider } from '@/features/providers/queries/use-save-provider';
import { AnthropicCacheTtl } from '@/features/providers/types/anthropic-cache-ttl';
import type { Provider } from '@/features/providers/types/provider';
import { ProviderApiFormatType } from '@/features/providers/types/provider-api-format-type';
import { ProviderConfigType } from '@/features/providers/types/provider-config-type';
import type { ProviderInput } from '@/features/providers/types/provider-input';
import {
  ProviderFormAnthropicFields,
  type AnthropicFieldErrors,
} from '@/features/providers/views/provider-form-anthropic-fields';
import { toastError } from '@/features/toasts/actions/toast-error';
import { toastWarning } from '@/features/toasts/actions/toast-warning';
import { useFieldErrors } from '@/shared/hooks/use-field-errors';
import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';
import { validateHttpUrl } from '@/shared/lib/validate-http-url';
import { validatePositiveInt } from '@/shared/lib/validate-positive-int';
import { validateTrimmedNonEmpty } from '@/shared/lib/validate-trimmed-non-empty';
import { FormMode } from '@/shared/types/form-mode';
import { Button } from '@/shared/views/button';
import { Checkbox } from '@/shared/views/checkbox';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogForm } from '@/shared/views/dialog-form';
import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { KindPicker } from '@/shared/views/kind-picker';
import { Label } from '@/shared/views/label';
import { Select } from '@/shared/views/select';
import { SelectContent } from '@/shared/views/select-content';
import { SelectItem } from '@/shared/views/select-item';
import { SelectTrigger } from '@/shared/views/select-trigger';
import { SelectValue } from '@/shared/views/select-value';
import { SubmitButtonContent } from '@/shared/views/submit-button-content';

interface ProviderFormProps {
  mode: FormMode;
  provider: Provider | null;
  preferences: Preference[];
  onClose: () => void;
  onSaved?: (provider: Provider) => void;
  hideCancel?: boolean;
  hideName?: boolean;
  hideAutoAddLlmModels?: boolean;
}

interface ProviderFormValues {
  name: string;
  apiKey: string;
  baseUrl: string;
  kind: ProviderConfigType | null;
  apiFormat: ProviderApiFormatType;
  reasoningMinimal: number;
  reasoningLow: number;
  reasoningMedium: number;
  reasoningHigh: number;
  reasoningXhigh: number;
}

const REASONING_MINIMAL_DEFAULT_TOKENS = 1024;
const REASONING_LOW_DEFAULT_TOKENS = 4096;
const REASONING_MEDIUM_DEFAULT_TOKENS = 10000;
const REASONING_HIGH_DEFAULT_TOKENS = 20000;
const REASONING_XHIGH_DEFAULT_TOKENS = 65536;

function validateFormValues(values: ProviderFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.kind === null) {
    errors['kind'] = translate('providers.pickType');
  }
  const nameError = validateTrimmedNonEmpty(values.name);
  if (nameError !== null) {
    errors['name'] = nameError;
  }
  if (isAutoAddSupportedProviderType(values.kind)) {
    const apiKeyError = validateTrimmedNonEmpty(
      values.apiKey,
      translate('providers.apiKeyRequired'),
    );
    if (apiKeyError !== null) {
      errors['apiKey'] = apiKeyError;
    }
  }
  if (values.kind === ProviderConfigType.LmStudio) {
    const urlError = validateHttpUrl(values.baseUrl);
    if (urlError !== null) {
      errors['baseUrl'] = urlError;
    }
  }
  if (values.kind === ProviderConfigType.Custom) {
    const urlError = validateHttpUrl(values.baseUrl);
    if (urlError !== null) {
      errors['baseUrl'] = urlError;
    }
    if (values.apiFormat === ProviderApiFormatType.Anthropic) {
      const reasoningChecks = [
        { field: values.reasoningMinimal, key: 'reasoningMinimal' },
        { field: values.reasoningLow, key: 'reasoningLow' },
        { field: values.reasoningMedium, key: 'reasoningMedium' },
        { field: values.reasoningHigh, key: 'reasoningHigh' },
        { field: values.reasoningXhigh, key: 'reasoningXhigh' },
      ];
      for (const check of reasoningChecks) {
        const reasoningError = validatePositiveInt(check.field);
        if (reasoningError !== null) {
          errors[check.key] = reasoningError;
        }
      }
    }
  }
  return errors;
}

export const ProviderForm = ({
  mode,
  provider,
  preferences,
  onClose,
  onSaved,
  hideCancel = false,
  hideName = false,
  hideAutoAddLlmModels = false,
}: ProviderFormProps): React.ReactElement => {
  const save = useSaveProvider();
  const saveLlmModel = useSaveLlmModel();

  const [snapshotProvider] = React.useState(provider);
  const [snapshotPreferences] = React.useState(preferences);
  const [isAutoAddingLlmModels, setIsAutoAddingLlmModels] = React.useState(true);
  const [isAutoAddInFlight, setIsAutoAddInFlight] = React.useState(false);

  const initialKind: ProviderConfigType | null = snapshotProvider?.config.type ?? null;

  const [name, setName] = React.useState((): string => snapshotProvider?.name ?? '');
  const [kind, setKindRaw] = React.useState<ProviderConfigType | null>(initialKind);
  const [apiKey, setApiKey] = React.useState((): string =>
    initialApiKeyFromProvider(snapshotProvider),
  );
  const [baseUrl, setBaseUrl] = React.useState((): string =>
    initialBaseUrlFromProvider(snapshotProvider),
  );

  const initialApiFormat: ProviderApiFormatType =
    snapshotProvider?.config.type === ProviderConfigType.Custom
      ? snapshotProvider.config.apiFormat.type
      : ProviderApiFormatType.OpenaiChatCompletions;
  const [apiFormat, setApiFormat] = React.useState<ProviderApiFormatType>(initialApiFormat);

  const initialAnthropic =
    snapshotProvider?.config.type === ProviderConfigType.Custom &&
    snapshotProvider.config.apiFormat.type === ProviderApiFormatType.Anthropic
      ? snapshotProvider.config.apiFormat
      : null;

  const [reasoningMinimal, setReasoningMinimal] = React.useState(
    (): number =>
      initialAnthropic?.reasoningMinimalBudgetTokens ??
      readIntPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicReasoningMinimalBudgetTokens,
        REASONING_MINIMAL_DEFAULT_TOKENS,
      ),
  );
  const [reasoningLow, setReasoningLow] = React.useState(
    (): number =>
      initialAnthropic?.reasoningLowBudgetTokens ??
      readIntPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicReasoningLowBudgetTokens,
        REASONING_LOW_DEFAULT_TOKENS,
      ),
  );
  const [reasoningMedium, setReasoningMedium] = React.useState(
    (): number =>
      initialAnthropic?.reasoningMediumBudgetTokens ??
      readIntPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicReasoningMediumBudgetTokens,
        REASONING_MEDIUM_DEFAULT_TOKENS,
      ),
  );
  const [reasoningHigh, setReasoningHigh] = React.useState(
    (): number =>
      initialAnthropic?.reasoningHighBudgetTokens ??
      readIntPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicReasoningHighBudgetTokens,
        REASONING_HIGH_DEFAULT_TOKENS,
      ),
  );
  const [reasoningXhigh, setReasoningXhigh] = React.useState(
    (): number =>
      initialAnthropic?.reasoningXhighBudgetTokens ??
      readIntPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicReasoningXhighBudgetTokens,
        REASONING_XHIGH_DEFAULT_TOKENS,
      ),
  );
  const [cacheMediumTtl, setCacheMediumTtl] = React.useState<AnthropicCacheTtl>(
    (): AnthropicCacheTtl =>
      initialAnthropic?.cacheMediumTtl ??
      readCacheTtlPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicCacheMediumTtl,
        AnthropicCacheTtl.Min5,
      ),
  );
  const [cacheHighTtl, setCacheHighTtl] = React.useState<AnthropicCacheTtl>(
    (): AnthropicCacheTtl =>
      initialAnthropic?.cacheHighTtl ??
      readCacheTtlPreference(
        snapshotPreferences,
        PreferenceKey.AnthropicCacheHighTtl,
        AnthropicCacheTtl.Hour1,
      ),
  );

  const setKind = (next: ProviderConfigType): void => {
    const previousLabel = kind !== null ? translate(PROVIDER_KIND_LABEL_KEY[kind]) : null;
    setKindRaw(next);
    const trimmed = trimSpaces(name);
    if (trimmed.length === 0 || (previousLabel !== null && trimmed === previousLabel)) {
      setName(translate(PROVIDER_KIND_LABEL_KEY[next]));
    }
    if (next === ProviderConfigType.LmStudio) {
      setBaseUrl(LM_STUDIO_DEFAULT_BASE_URL);
    } else if (next === ProviderConfigType.Custom) {
      setBaseUrl('');
    }
  };

  const formValues: ProviderFormValues = {
    name,
    apiKey,
    baseUrl,
    kind,
    apiFormat,
    reasoningMinimal,
    reasoningLow,
    reasoningMedium,
    reasoningHigh,
    reasoningXhigh,
  };

  const validate = React.useCallback(
    (values: ProviderFormValues): Record<string, string> => validateFormValues(values),
    [],
  );

  const fieldErrors = useFieldErrors(formValues, validate);

  const submit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || save.isPending) {
      return;
    }
    if (kind === null) {
      return;
    }
    const customApiFormat = buildProviderApiFormat(apiFormat, {
      reasoningMinimalBudgetTokens: reasoningMinimal,
      reasoningLowBudgetTokens: reasoningLow,
      reasoningMediumBudgetTokens: reasoningMedium,
      reasoningHighBudgetTokens: reasoningHigh,
      reasoningXhighBudgetTokens: reasoningXhigh,
      cacheMediumTtl,
      cacheHighTtl,
    });
    const config = buildProviderConfig({
      kind,
      trimmedApiKey: trimSpaces(apiKey),
      trimmedBaseUrl: trimSpaces(baseUrl),
      customApiFormat,
    });
    const input: ProviderInput = { name: trimSpaces(name), config };
    let savedProvider: Provider;
    try {
      savedProvider = await save.mutateAsync({ input, id: snapshotProvider?.id ?? null });
    } catch (caught) {
      toastError(caught);
      return;
    }
    const savedProviderType = savedProvider.config.type;
    if (!isEditing && isAutoAddingLlmModels && isAutoAddSupportedProviderType(savedProviderType)) {
      setIsAutoAddInFlight(true);
      try {
        const { failedNames } = await runAutoAddLlmModelsForProvider(
          savedProvider.id,
          savedProviderType,
          saveLlmModel,
        );
        if (failedNames.length > 0) {
          toastWarning(
            translate('providers.autoAddModelsFailed', { names: failedNames.join(', ') }),
          );
        }
      } finally {
        setIsAutoAddInFlight(false);
      }
    }
    onSaved?.(savedProvider);
    onClose();
  };

  const isPending = save.isPending || isAutoAddInFlight;
  const isEditing = mode === FormMode.Edit;

  const anthropicErrors: AnthropicFieldErrors = {
    reasoningMinimal: fieldErrors.errorFor('reasoningMinimal'),
    reasoningLow: fieldErrors.errorFor('reasoningLow'),
    reasoningMedium: fieldErrors.errorFor('reasoningMedium'),
    reasoningHigh: fieldErrors.errorFor('reasoningHigh'),
    reasoningXhigh: fieldErrors.errorFor('reasoningXhigh'),
  };

  return (
    <DialogForm
      onSubmit={(event): void => {
        void submit(event);
      }}
    >
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{translate('providers.typeLabel')}</Label>
            <KindPicker
              options={PROVIDER_KIND_OPTIONS}
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
              <div className="text-[11px] text-muted">
                {translate('providers.typeCannotChange')}
              </div>
            ) : null}
          </div>
          {hideName ? null : (
            <div className="flex flex-col gap-1">
              <Label htmlFor="provider-name">{translate('providers.nameLabel')}</Label>
              <Input
                id="provider-name"
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
          )}
          {isAutoAddSupportedProviderType(kind) ? (
            <>
              <div className="flex flex-col gap-1">
                <Label htmlFor="provider-api-key">{translate('providers.apiKeyLabel')}</Label>
                <Input
                  id="provider-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(event): void => {
                    setApiKey(event.target.value);
                  }}
                  onBlur={(): void => {
                    fieldErrors.touch('apiKey');
                  }}
                  isInvalid={Boolean(fieldErrors.errorFor('apiKey'))}
                  disabled={isPending}
                />
                <FieldError message={fieldErrors.errorFor('apiKey')} />
              </div>
              {!isEditing && !hideAutoAddLlmModels ? (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={isAutoAddingLlmModels}
                    onCheckedChange={(checked): void => {
                      setIsAutoAddingLlmModels(checked === true);
                    }}
                    disabled={isPending}
                  />
                  <span className="text-[13px] text-primary">
                    {translate('providers.autoAddModelsLabel')}
                  </span>
                </label>
              ) : null}
            </>
          ) : null}
          {kind === ProviderConfigType.LmStudio ? (
            <div className="flex flex-col gap-1">
              <Label htmlFor="provider-base-url">{translate('providers.baseUrlLabel')}</Label>
              <Input
                id="provider-base-url"
                value={baseUrl}
                onChange={(event): void => {
                  setBaseUrl(event.target.value);
                }}
                onBlur={(): void => {
                  fieldErrors.touch('baseUrl');
                }}
                isInvalid={Boolean(fieldErrors.errorFor('baseUrl'))}
                disabled={isPending}
              />
              <FieldError message={fieldErrors.errorFor('baseUrl')} />
            </div>
          ) : null}
          {kind === ProviderConfigType.Custom ? (
            <>
              <div className="flex flex-col gap-1">
                <Label htmlFor="provider-base-url">{translate('providers.baseUrlLabel')}</Label>
                <Input
                  id="provider-base-url"
                  value={baseUrl}
                  onChange={(event): void => {
                    setBaseUrl(event.target.value);
                  }}
                  onBlur={(): void => {
                    fieldErrors.touch('baseUrl');
                  }}
                  isInvalid={Boolean(fieldErrors.errorFor('baseUrl'))}
                  disabled={isPending}
                />
                <FieldError message={fieldErrors.errorFor('baseUrl')} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="provider-api-key">
                  {translate('providers.apiKeyOptionalLabel')}
                </Label>
                <Input
                  id="provider-api-key"
                  type="password"
                  value={apiKey}
                  onChange={(event): void => {
                    setApiKey(event.target.value);
                  }}
                  disabled={isPending}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>{translate('providers.apiFormatLabel')}</Label>
                <Select
                  value={apiFormat}
                  onValueChange={(value): void => {
                    setApiFormat(value as ProviderApiFormatType);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDER_API_FORMAT_OPTIONS.map(
                      (option): React.ReactElement => (
                        <SelectItem key={option.value} value={option.value}>
                          {translate(option.labelKey)}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              {apiFormat === ProviderApiFormatType.Anthropic ? (
                <ProviderFormAnthropicFields
                  values={{
                    reasoningMinimal,
                    reasoningLow,
                    reasoningMedium,
                    reasoningHigh,
                    reasoningXhigh,
                    cacheMediumTtl,
                    cacheHighTtl,
                  }}
                  errors={anthropicErrors}
                  isPending={isPending}
                  onReasoningMinimalChange={setReasoningMinimal}
                  onReasoningLowChange={setReasoningLow}
                  onReasoningMediumChange={setReasoningMedium}
                  onReasoningHighChange={setReasoningHigh}
                  onReasoningXhighChange={setReasoningXhigh}
                  onCacheMediumTtlChange={setCacheMediumTtl}
                  onCacheHighTtlChange={setCacheHighTtl}
                  onReasoningMinimalBlur={(): void => {
                    fieldErrors.touch('reasoningMinimal');
                  }}
                  onReasoningLowBlur={(): void => {
                    fieldErrors.touch('reasoningLow');
                  }}
                  onReasoningMediumBlur={(): void => {
                    fieldErrors.touch('reasoningMedium');
                  }}
                  onReasoningHighBlur={(): void => {
                    fieldErrors.touch('reasoningHigh');
                  }}
                  onReasoningXhighBlur={(): void => {
                    fieldErrors.touch('reasoningXhigh');
                  }}
                />
              ) : null}
            </>
          ) : null}
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
          {isEditing ? translate('common.saveChanges') : translate('providers.addProvider')}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
};
