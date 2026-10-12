import * as React from 'react';

import { Plus, Save, X } from 'lucide-react';

import { useAgents } from '@/features/agents/queries/use-agents';
import type { Agent } from '@/features/agents/types/agent';
import { AgentPicker } from '@/features/agents/views/agent-picker';
import { useConversation } from '@/features/conversations/queries/use-conversation';
import { useSaveConversation } from '@/features/conversations/queries/use-save-conversation';
import type { Conversation } from '@/features/conversations/types/conversation';
import { useLlmModels } from '@/features/llm-models/queries/use-llm-models';
import type { LlmModel } from '@/features/llm-models/types/llm-model';
import { useProviders } from '@/features/providers/queries/use-providers';
import type { Provider } from '@/features/providers/types/provider';
import { toastError } from '@/features/toasts/actions/toast-error';
import { useFieldErrors } from '@/shared/hooks/use-field-errors';
import { translate } from '@/shared/i18n/translate';
import { trimSpaces } from '@/shared/lib/trim-spaces';
import { Button } from '@/shared/views/button';
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
import { Spinner } from '@/shared/views/spinner';

interface ConversationFormDialogProps {
  isCreating: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  conversationId: string | null;
  presetAgentId: string | null;
  onConversationCreated: (conversationId: string) => void;
  onCreateAgent: () => void;
}

interface ConversationFormProps {
  isCreating: boolean;
  initial: Conversation | null;
  conversationId: string | null;
  presetAgentId: string | null;
  agents: Agent[];
  models: LlmModel[];
  providers: Provider[];
  onSuccess: () => void;
  onCancel: () => void;
  onConversationCreated: (conversationId: string) => void;
  onCreateAgent: () => void;
}

const ConversationForm = ({
  isCreating,
  initial,
  conversationId,
  presetAgentId,
  agents,
  models,
  providers,
  onSuccess,
  onCancel,
  onConversationCreated,
  onCreateAgent,
}: ConversationFormProps): React.ReactElement => {
  const saveConversation = useSaveConversation();

  const [snapshotInitial] = React.useState(initial);
  const [snapshotConversationId] = React.useState(conversationId);
  const [agentsSnapshot] = React.useState(agents);
  const [modelsSnapshot] = React.useState(models);
  const [providersSnapshot] = React.useState(providers);

  const [name, setName] = React.useState(snapshotInitial?.name ?? '');
  const [agentId, setAgentId] = React.useState(snapshotInitial?.agentId ?? presetAgentId ?? '');

  const formValues = { agentId };
  const validate = React.useCallback((values: typeof formValues): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (values.agentId.length === 0) {
      errors['agentId'] = translate('conversations.pickAgent');
    }
    return errors;
  }, []);

  const fieldErrors = useFieldErrors(formValues, validate);

  const submit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    fieldErrors.touchAll();
    if (!fieldErrors.isValid || saveConversation.isPending) {
      return;
    }
    const trimmedName = trimSpaces(name);
    const namePayload = trimmedName.length === 0 ? null : trimmedName;
    try {
      const saved = await saveConversation.mutateAsync({
        input: { name: namePayload, agentId },
        id: isCreating ? null : snapshotConversationId,
      });
      if (isCreating) {
        onConversationCreated(saved.id);
      }
      onSuccess();
    } catch (caught) {
      toastError(caught);
    }
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    void submit(event);
  };

  const isPending = saveConversation.isPending;

  const renderSubmitIcon = (): React.ReactElement => {
    if (isPending) {
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
        <div className="flex flex-col gap-4">
          {isCreating ? null : (
            <div className="flex flex-col gap-1">
              <Label htmlFor="conversation-name">{translate('conversations.nameLabel')}</Label>
              <Input
                id="conversation-name"
                value={name}
                onChange={(event): void => {
                  setName(event.target.value);
                }}
                disabled={isPending}
              />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label>{translate('conversations.agentLabel')}</Label>
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
              disabled={isPending}
            />
            <FieldError message={fieldErrors.errorFor('agentId')} />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X size={13} />
          {translate('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {renderSubmitIcon()}
          {isCreating ? translate('conversations.create') : translate('conversations.rename')}
        </Button>
      </DialogFooter>
    </DialogForm>
  );
};

export const ConversationFormDialog = ({
  isCreating,
  isOpen,
  onOpenChange,
  conversationId,
  presetAgentId,
  onConversationCreated,
  onCreateAgent,
}: ConversationFormDialogProps): React.ReactElement => {
  const conversationQuery = useConversation(isCreating ? null : conversationId);
  const agentsQuery = useAgents();
  const modelsQuery = useLlmModels(null);
  const providersQuery = useProviders();

  const bootstrapQueries = isCreating
    ? [agentsQuery, modelsQuery, providersQuery]
    : [conversationQuery, agentsQuery, modelsQuery, providersQuery];

  const handleClose = (): void => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>
            {isCreating ? translate('conversations.new') : translate('conversations.edit')}
          </DialogTitle>
        </DialogHeader>
        <FormBootstrap queries={bootstrapQueries} loadingClassName="min-h-[260px]">
          <ConversationForm
            isCreating={isCreating}
            initial={conversationQuery.data ?? null}
            conversationId={conversationId}
            presetAgentId={presetAgentId}
            agents={agentsQuery.data ?? []}
            models={modelsQuery.data ?? []}
            providers={providersQuery.data ?? []}
            onSuccess={handleClose}
            onCancel={handleClose}
            onConversationCreated={onConversationCreated}
            onCreateAgent={onCreateAgent}
          />
        </FormBootstrap>
      </DialogContent>
    </Dialog>
  );
};
