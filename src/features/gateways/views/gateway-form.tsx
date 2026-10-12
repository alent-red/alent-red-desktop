import * as React from 'react';

import { X } from 'lucide-react';

import type { Agent } from '@/features/agents/types/agent';
import { AgentPicker } from '@/features/agents/views/agent-picker';
import { GATEWAY_KIND_LABEL_KEY } from '@/features/gateways/constants/gateway-kind-label-key';
import { GATEWAY_KIND_OPTIONS } from '@/features/gateways/constants/gateway-kind-options';
import { buildEmptyAllowedUserNameEntry } from '@/features/gateways/lib/build-empty-allowed-user-name-entry';
import { buildGatewayConfig } from '@/features/gateways/lib/build-gateway-config';
import { canonicalizeAllowedUserNameEntries } from '@/features/gateways/lib/canonicalize-allowed-user-name-entries';
import { canonicalizeTelegramUsername } from '@/features/gateways/lib/canonicalize-telegram-username';
import { validateTelegramUsername } from '@/features/gateways/lib/validate-telegram-username';
import { useSaveGateway } from '@/features/gateways/queries/use-save-gateway';
import type { Gateway } from '@/features/gateways/types/gateway';
import { GatewayConfigType } from '@/features/gateways/types/gateway-config-type';
import type { GatewayInput } from '@/features/gateways/types/gateway-input';
import type { AllowedUserNameEntry } from '@/features/gateways/views/gateway-allowed-user-names-list';
import { GatewayFormTelegramFields } from '@/features/gateways/views/gateway-form-telegram-fields';
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
import { Switch } from '@/shared/views/switch';

interface GatewayFormProps {
  mode: FormMode;
  gateway: Gateway | null;
  agents: Agent[];
  models: LlmModel[];
  providers: Provider[];
  onClose: () => void;
  onCreateAgent: () => void;
}

interface GatewayFormValues {
  kind: GatewayConfigType | null;
  name: string;
  agentId: string;
  token: string;
}

function validateFormValues(values: GatewayFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (values.kind === null) {
    errors['kind'] = translate('gateways.pickType');
  }
  const nameError = validateTrimmedNonEmpty(values.name);
  if (nameError !== null) {
    errors['name'] = nameError;
  }
  if (values.agentId.length === 0) {
    errors['agentId'] = translate('gateways.pickAgent');
  }
  if (values.kind === GatewayConfigType.Telegram) {
    const tokenError = validateTrimmedNonEmpty(values.token, translate('gateways.tokenRequired'));
    if (tokenError !== null) {
      errors['token'] = tokenError;
    }
  }
  return errors;
}

function buildInitialAllowedUserNameEntries(initial: string[]): AllowedUserNameEntry[] {
  if (initial.length === 0) {
    return [buildEmptyAllowedUserNameEntry(0)];
  }
  return initial.map(
    (value, index): AllowedUserNameEntry => ({
      id: `allowed-initial-${String(index)}`,
      value,
      error: null,
      isTouched: false,
    }),
  );
}

export const GatewayForm = ({
  mode,
  gateway,
  agents,
  models,
  providers,
  onClose,
  onCreateAgent,
}: GatewayFormProps): React.ReactElement => {
  const save = useSaveGateway();

  const [snapshotGateway] = React.useState(gateway);
  const [agentsSnapshot] = React.useState(agents);
  const [modelsSnapshot] = React.useState(models);
  const [providersSnapshot] = React.useState(providers);

  const initialKind: GatewayConfigType | null = snapshotGateway?.config.type ?? null;

  const [name, setName] = React.useState((): string => snapshotGateway?.name ?? '');
  const [kind, setKindRaw] = React.useState<GatewayConfigType | null>(initialKind);
  const [agentId, setAgentId] = React.useState((): string => snapshotGateway?.agentId ?? '');
  const [sendDetailedMessages, setSendDetailedMessages] = React.useState(
    (): boolean => snapshotGateway?.sendDetailedMessages ?? false,
  );

  const initialTelegram =
    snapshotGateway?.config.type === GatewayConfigType.Telegram ? snapshotGateway.config : null;
  const [token, setToken] = React.useState((): string => initialTelegram?.token ?? '');
  const [allowAll, setAllowAll] = React.useState((): boolean => initialTelegram?.allowAll ?? false);
  const [allowedUserNameEntries, setAllowedUserNameEntries] = React.useState<
    AllowedUserNameEntry[]
  >((): AllowedUserNameEntry[] =>
    buildInitialAllowedUserNameEntries(initialTelegram?.allowedUserNames ?? []),
  );
  const allowedEntrySeedRef = React.useRef(allowedUserNameEntries.length);

  const isEditing = mode === FormMode.Edit;

  const setKind = (next: GatewayConfigType): void => {
    const previousLabel = kind !== null ? translate(GATEWAY_KIND_LABEL_KEY[kind]) : null;
    setKindRaw(next);
    const trimmed = trimSpaces(name);
    if (trimmed.length === 0 || (previousLabel !== null && trimmed === previousLabel)) {
      setName(translate(GATEWAY_KIND_LABEL_KEY[next]));
    }
  };

  const formValues: GatewayFormValues = { kind, name, agentId, token };
  const validate = React.useCallback(
    (values: GatewayFormValues): Record<string, string> => validateFormValues(values),
    [],
  );
  const fieldErrors = useFieldErrors(formValues, validate);

  const handleAllowedEntryChange = (id: string, value: string): void => {
    setAllowedUserNameEntries((previous): AllowedUserNameEntry[] =>
      previous.map(
        (entry): AllowedUserNameEntry => (entry.id === id ? { ...entry, value } : entry),
      ),
    );
  };

  const handleAllowedEntryBlur = (id: string): void => {
    setAllowedUserNameEntries((previous): AllowedUserNameEntry[] =>
      previous.map((entry): AllowedUserNameEntry => {
        if (entry.id !== id) {
          return entry;
        }
        const canonical = canonicalizeTelegramUsername(entry.value);
        const error = canonical.length === 0 ? null : validateTelegramUsername(canonical);
        return { ...entry, value: canonical, error, isTouched: true };
      }),
    );
  };

  const handleAllowedEntryAdd = (): void => {
    allowedEntrySeedRef.current += 1;
    setAllowedUserNameEntries((previous): AllowedUserNameEntry[] => [
      ...previous,
      buildEmptyAllowedUserNameEntry(allowedEntrySeedRef.current),
    ]);
  };

  const handleAllowedEntryRemove = (id: string): void => {
    setAllowedUserNameEntries((previous): AllowedUserNameEntry[] => {
      const next = previous.filter((entry): boolean => entry.id !== id);
      return next.length === 0 ? [buildEmptyAllowedUserNameEntry(0)] : next;
    });
  };

  const submit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || save.isPending) {
      return;
    }
    if (kind !== GatewayConfigType.Telegram) {
      return;
    }

    let allowedUserNames: string[] = [];
    if (!allowAll) {
      const finalizedEntries = allowedUserNameEntries.map((entry): AllowedUserNameEntry => {
        const canonical = canonicalizeTelegramUsername(entry.value);
        const error = canonical.length === 0 ? null : validateTelegramUsername(canonical);
        return { ...entry, value: canonical, error, isTouched: true };
      });
      const hasInvalid = finalizedEntries.some((entry): boolean => entry.error !== null);
      if (hasInvalid) {
        setAllowedUserNameEntries(finalizedEntries);
        return;
      }
      setAllowedUserNameEntries(finalizedEntries);
      allowedUserNames = canonicalizeAllowedUserNameEntries(finalizedEntries);
    }

    const config = buildGatewayConfig({
      trimmedToken: trimSpaces(token),
      allowAll,
      allowedUserNames,
    });
    const input: GatewayInput = {
      name: trimSpaces(name),
      sendDetailedMessages,
      config,
      agentId,
    };
    try {
      await save.mutateAsync({ input, id: snapshotGateway?.id ?? null });
      onClose();
    } catch (caught) {
      toastError(caught);
    }
  };

  const isPending = save.isPending;

  return (
    <DialogForm
      onSubmit={(event): void => {
        void submit(event);
      }}
    >
      <DialogBody>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{translate('gateways.typeLabel')}</Label>
            <KindPicker
              options={GATEWAY_KIND_OPTIONS}
              value={kind}
              onChange={(value): void => {
                setKind(value);
                fieldErrors.touch('kind');
              }}
              disabled={isEditing || isPending}
              columns={3}
            />
            <FieldError message={fieldErrors.errorFor('kind')} />
            {isEditing ? (
              <div className="text-[11px] text-muted">{translate('gateways.typeCannotChange')}</div>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="gateway-name">{translate('gateways.nameLabel')}</Label>
            <Input
              id="gateway-name"
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

          {kind === GatewayConfigType.Telegram ? (
            <GatewayFormTelegramFields
              token={token}
              tokenError={fieldErrors.errorFor('token')}
              allowAll={allowAll}
              allowedUserNameEntries={allowedUserNameEntries}
              isPending={isPending}
              onTokenChange={setToken}
              onTokenBlur={(): void => {
                fieldErrors.touch('token');
              }}
              onAllowAllChange={setAllowAll}
              onAllowedUserNameEntryChange={handleAllowedEntryChange}
              onAllowedUserNameEntryBlur={handleAllowedEntryBlur}
              onAllowedUserNameEntryAdd={handleAllowedEntryAdd}
              onAllowedUserNameEntryRemove={handleAllowedEntryRemove}
            />
          ) : null}

          <div className="flex items-start justify-between gap-3 py-1">
            <div className="min-w-0 flex flex-col gap-0.5">
              <div className="text-[13px] font-medium text-primary">
                {translate('gateways.sendDetailedMessagesLabel')}
              </div>
              <div className="text-[12px] text-muted leading-snug">
                {translate('gateways.sendDetailedMessagesDescription')}
              </div>
            </div>
            <div className="shrink-0 pt-0.5">
              <Switch
                checked={sendDetailedMessages}
                onCheckedChange={setSendDetailedMessages}
                disabled={isPending}
                aria-label={translate('gateways.sendDetailedMessagesLabel')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{translate('gateways.agentLabel')}</Label>
            <AgentPicker
              agents={agentsSnapshot}
              models={modelsSnapshot}
              providers={providersSnapshot}
              value={agentId.length > 0 ? agentId : null}
              onChange={(value): void => {
                setAgentId(value);
                fieldErrors.touch('agentId');
              }}
              onCreateAgent={onCreateAgent}
              disabled={isEditing || isPending}
            />
            <FieldError message={fieldErrors.errorFor('agentId')} />
            {isEditing ? (
              <div className="text-[11px] text-muted">
                {translate('gateways.agentCannotChange')}
              </div>
            ) : null}
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          <X size={13} />
          {translate('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          <SubmitButtonContent isPending={isPending} mode={mode} />
          {isEditing ? translate('common.saveChanges') : translate('gateways.addGateway')}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
};
