import * as React from 'react';

import { Plus, Save, X } from 'lucide-react';

import { useAgent } from '@/features/agents/queries/use-agent';
import { useSaveAgent } from '@/features/agents/queries/use-save-agent';
import type { Agent } from '@/features/agents/types/agent';
import type { AgentInput } from '@/features/agents/types/agent-input';
import { AgentReasoning } from '@/features/agents/types/agent-reasoning';
import { AgentVerbosity } from '@/features/agents/types/agent-verbosity';
import { AgentAttachedFilePathsField } from '@/features/agents/views/agent-attached-file-paths-field';
import { AgentPicturePicker } from '@/features/agents/views/agent-picture-picker';
import { useBricks } from '@/features/bricks/queries/use-bricks';
import type { Brick } from '@/features/bricks/types/brick';
import { BrickSelector } from '@/features/bricks/views/brick-selector';
import { useLlmModels } from '@/features/llm-models/queries/use-llm-models';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { useProviders } from '@/features/providers/queries/use-providers';
import type { Provider } from '@/features/providers/types/provider';
import { toastError } from '@/features/toasts/actions/toast-error';
import { useFieldErrors } from '@/shared/hooks/use-field-errors';
import { translate, type TranslationKey } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';
import { validateTrimmedNonEmpty } from '@/shared/lib/validate-trimmed-non-empty';
import { AutoTextarea } from '@/shared/views/auto-textarea';
import { Button } from '@/shared/views/button';
import { Combobox, type ComboboxOption } from '@/shared/views/combobox';
import { Dialog } from '@/shared/views/dialog';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogForm } from '@/shared/views/dialog-form';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { FieldError } from '@/shared/views/field-error';
import { FormBootstrap } from '@/shared/views/form-bootstrap';
import { Input } from '@/shared/views/input';
import { Label } from '@/shared/views/label';
import { Select } from '@/shared/views/select';
import { SelectContent } from '@/shared/views/select-content';
import { SelectItem } from '@/shared/views/select-item';
import { SelectTrigger } from '@/shared/views/select-trigger';
import { SelectValue } from '@/shared/views/select-value';
import { Spinner } from '@/shared/views/spinner';

interface AgentFormDialogProps {
  isCreating: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  agentId: string | null;
  onOpenBricksSettings: () => void;
}

interface AgentFormProps {
  initial: Agent | null;
  providers: Provider[];
  allModels: LlmModel[];
  allBricks: Brick[];
  initialBricks: Brick[];
  isCreating: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  onOpenBricksSettings: () => void;
}

const REASONING_OPTIONS: { value: AgentReasoning; labelKey: TranslationKey }[] = [
  { value: AgentReasoning.Default, labelKey: 'agents.reasoningDefault' },
  { value: AgentReasoning.Minimal, labelKey: 'agents.reasoningMinimal' },
  { value: AgentReasoning.Low, labelKey: 'agents.reasoningLow' },
  { value: AgentReasoning.Medium, labelKey: 'agents.reasoningMedium' },
  { value: AgentReasoning.High, labelKey: 'agents.reasoningHigh' },
  { value: AgentReasoning.Xhigh, labelKey: 'agents.reasoningXhigh' },
];

const VERBOSITY_OPTIONS: { value: AgentVerbosity; labelKey: TranslationKey }[] = [
  { value: AgentVerbosity.Default, labelKey: 'agents.verbosityDefault' },
  { value: AgentVerbosity.Low, labelKey: 'agents.verbosityLow' },
  { value: AgentVerbosity.Medium, labelKey: 'agents.verbosityMedium' },
  { value: AgentVerbosity.High, labelKey: 'agents.verbosityHigh' },
];

const AgentForm = ({
  initial,
  providers,
  allModels,
  allBricks,
  initialBricks,
  isCreating,
  onSuccess,
  onCancel,
  onOpenBricksSettings,
}: AgentFormProps): React.ReactElement => {
  const saveAgent = useSaveAgent();

  const [snapshotInitial] = React.useState(initial);
  const [snapshotInitialBricks] = React.useState(initialBricks);
  const [providersSnapshot] = React.useState(providers);
  const [allModelsSnapshot] = React.useState(allModels);
  const [allBricksSnapshot] = React.useState(allBricks);

  const [name, setName] = React.useState(snapshotInitial?.name ?? '');
  const [prompt, setPrompt] = React.useState(snapshotInitial?.prompt ?? '');
  const [pictureFileKey, setPictureFileKey] = React.useState<string | null>(
    snapshotInitial?.pictureFileKey ?? null,
  );
  const [reasoning, setReasoning] = React.useState<AgentReasoning>(
    snapshotInitial?.reasoning ?? AgentReasoning.Default,
  );
  const [verbosity, setVerbosity] = React.useState<AgentVerbosity>(
    snapshotInitial?.verbosity ?? AgentVerbosity.Default,
  );
  const [llmModelId, setLlmModelId] = React.useState(snapshotInitial?.llmModelId ?? '');
  const [attachedFilePaths, setAttachedFilePaths] = React.useState<string[]>(
    (): string[] => snapshotInitial?.attachedFilePaths ?? [],
  );

  const initialAgentModel = allModelsSnapshot.find(
    (model): boolean => model.id === snapshotInitial?.llmModelId,
  );
  const [providerId, setProviderId] = React.useState<string>(initialAgentModel?.providerId ?? '');

  const [selectedBrickIds, setSelectedBrickIds] = React.useState<Set<string>>(
    (): Set<string> => new Set(snapshotInitialBricks.map((brick): string => brick.id)),
  );

  const trimmedName = trimSpaces(name);
  const trimmedPrompt = trimSpaces(prompt);

  const formValues = { name, providerId, llmModelId };
  const validate = React.useCallback((values: typeof formValues): Record<string, string> => {
    const errors: Record<string, string> = {};
    const nameError = validateTrimmedNonEmpty(values.name, translate('agents.nameRequired'));
    if (nameError !== null) {
      errors['name'] = nameError;
    }
    if (values.providerId.length === 0) {
      errors['providerId'] = translate('agents.pickProvider');
    }
    if (values.llmModelId.length === 0) {
      errors['llmModelId'] = translate('agents.pickModel');
    }
    return errors;
  }, []);

  const fieldErrors = useFieldErrors(formValues, validate);

  const providerOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] =>
      providersSnapshot.map(
        (provider): ComboboxOption => ({ value: provider.id, label: provider.name }),
      ),
    [providersSnapshot],
  );

  const modelOptions: ComboboxOption[] = React.useMemo(
    (): ComboboxOption[] =>
      allModelsSnapshot
        .filter((model): boolean => model.providerId === providerId)
        .map((model): ComboboxOption => ({ value: model.id, label: model.name })),
    [allModelsSnapshot, providerId],
  );

  const submit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || saveAgent.isPending) {
      return;
    }
    const input: AgentInput = {
      name: trimmedName,
      pictureFileKey,
      prompt: trimmedPrompt.length === 0 ? null : trimmedPrompt,
      reasoning,
      verbosity,
      llmModelId,
      brickIds: Array.from(selectedBrickIds),
      attachedFilePaths,
    };
    try {
      await saveAgent.mutateAsync({ input, id: snapshotInitial?.id ?? null });
      onSuccess();
    } catch (caught) {
      toastError(caught);
    }
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    void submit(event);
  };

  const isPending = saveAgent.isPending;

  const renderSubmitIcon = (): React.ReactElement => {
    if (saveAgent.isPending) {
      return <Spinner size={13} className="text-current" />;
    }
    if (isCreating) {
      return <Plus size={13} />;
    }
    return <Save size={13} />;
  };

  return (
    <DialogForm onSubmit={handleSubmit}>
      <DialogBody>
        <div className="grid grid-cols-[72px_1fr] gap-4 items-center mb-4">
          <AgentPicturePicker
            name={trimmedName.length > 0 ? trimmedName : '?'}
            pictureFileKey={pictureFileKey}
            size={72}
            onChange={setPictureFileKey}
            disabled={isPending}
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="agent-name">{translate('agents.nameLabel')}</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(event): void => {
                setName(event.target.value);
              }}
              onBlur={(): void => {
                fieldErrors.touch('name');
              }}
              isInvalid={fieldErrors.errorFor('name') !== null}
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('name')} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="agent-prompt">{translate('agents.promptLabel')}</Label>
            <AutoTextarea
              id="agent-prompt"
              isResizable
              minRows={2}
              maxRows={6}
              value={prompt}
              onChange={(event): void => {
                setPrompt(event.target.value);
              }}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>{translate('agents.providerStep')}</Label>
              <Combobox
                options={providerOptions}
                value={providerId}
                onChange={(value): void => {
                  setProviderId(value);
                  setLlmModelId('');
                  fieldErrors.touch('providerId');
                }}
                placeholder={translate('agents.providerPlaceholder')}
                searchPlaceholder={translate('agents.searchProviders')}
                emptyMessage={translate('agents.noProviders')}
                isInvalid={fieldErrors.errorFor('providerId') !== null}
                disabled={isPending}
              />
              <FieldError message={fieldErrors.errorFor('providerId')} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>{translate('agents.llmModelLabel')}</Label>
              <Combobox
                options={modelOptions}
                value={llmModelId}
                onChange={(value): void => {
                  setLlmModelId(value);
                  fieldErrors.touch('llmModelId');
                }}
                placeholder={translate('agents.llmModelPlaceholder')}
                searchPlaceholder={translate('agents.searchModels')}
                emptyMessage={translate('agents.noModels')}
                disabled={providerId.length === 0 || isPending}
                isInvalid={fieldErrors.errorFor('llmModelId') !== null}
              />
              <FieldError message={fieldErrors.errorFor('llmModelId')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label>{translate('agents.reasoningLabel')}</Label>
              <Select
                value={reasoning}
                onValueChange={(value): void => {
                  setReasoning(value as AgentReasoning);
                }}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REASONING_OPTIONS.map(
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
              <Label>{translate('agents.verbosityLabel')}</Label>
              <Select
                value={verbosity}
                onValueChange={(value): void => {
                  setVerbosity(value as AgentVerbosity);
                }}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VERBOSITY_OPTIONS.map(
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

          <AgentAttachedFilePathsField
            paths={attachedFilePaths}
            isDisabled={isPending}
            onChange={setAttachedFilePaths}
          />

          <div className="flex flex-col gap-1.5">
            <Label>{translate('agents.bricksLabel')}</Label>
            <BrickSelector
              bricks={allBricksSnapshot}
              selectedBrickIds={selectedBrickIds}
              onChange={setSelectedBrickIds}
              onOpenSettings={onOpenBricksSettings}
              disabled={isPending}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X size={13} />
          {translate('agents.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={saveAgent.isPending}>
          {renderSubmitIcon()}
          {isCreating ? translate('agents.save') : translate('agents.update')}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
};

export const AgentFormDialog = ({
  isCreating,
  isOpen,
  onOpenChange,
  agentId,
  onOpenBricksSettings,
}: AgentFormDialogProps): React.ReactElement => {
  const agentQuery = useAgent(isCreating ? null : agentId);
  const providersQuery = useProviders();
  const allModelsQuery = useLlmModels(null);
  const allBricksQuery = useBricks(null);
  const agentBricksQuery = useBricks(isCreating ? null : agentId);

  const bootstrapQueries = isCreating
    ? [providersQuery, allModelsQuery, allBricksQuery]
    : [agentQuery, providersQuery, allModelsQuery, allBricksQuery, agentBricksQuery];

  const handleClose = (): void => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? translate('agents.create') : translate('agents.edit')}
          </DialogTitle>
        </DialogHeader>
        <FormBootstrap queries={bootstrapQueries} loadingClassName="min-h-[260px]">
          <AgentForm
            initial={agentQuery.data ?? null}
            providers={providersQuery.data ?? []}
            allModels={allModelsQuery.data ?? []}
            allBricks={allBricksQuery.data ?? []}
            initialBricks={agentBricksQuery.data ?? []}
            isCreating={isCreating}
            onSuccess={handleClose}
            onCancel={handleClose}
            onOpenBricksSettings={onOpenBricksSettings}
          />
        </FormBootstrap>
      </DialogContent>
    </Dialog>
  );
};
