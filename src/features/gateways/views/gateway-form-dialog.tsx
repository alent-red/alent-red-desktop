import * as React from 'react';

import { useAgents } from '@/features/agents/queries/use-agents';
import { useGateway } from '@/features/gateways/queries/use-gateway';
import { GatewayForm } from '@/features/gateways/views/gateway-form';
import { useLlmModels } from '@/features/llm-models/queries/use-llm-models';
import { useProviders } from '@/features/providers/queries/use-providers';
import { translate } from '@/shared/i18n/translate';
import { FormMode } from '@/shared/types/form-mode';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { FormBootstrap } from '@/shared/views/form-bootstrap';

interface GatewayFormDialogProps {
  mode: FormMode;
  gatewayId: string | null;
  onClose: () => void;
  onCreateAgent: () => void;
}

export const GatewayFormDialog = ({
  mode,
  gatewayId,
  onClose,
  onCreateAgent,
}: GatewayFormDialogProps): React.ReactElement => {
  const agentsQuery = useAgents();
  const modelsQuery = useLlmModels(null);
  const providersQuery = useProviders();
  const gatewayQuery = useGateway(mode === FormMode.Edit ? gatewayId : undefined);
  const bootstrapQueries =
    mode === FormMode.Edit
      ? [agentsQuery, modelsQuery, providersQuery, gatewayQuery]
      : [agentsQuery, modelsQuery, providersQuery];
  return (
    <Dialog
      open
      onOpenChange={(isOpen): void => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md" isNested>
        <DialogHeader>
          <DialogTitle>
            {mode === FormMode.Create
              ? translate('gateways.addGatewayTitle')
              : translate('gateways.editGatewayTitle')}
          </DialogTitle>
        </DialogHeader>
        <FormBootstrap queries={bootstrapQueries} loadingClassName="min-h-[300px]">
          <GatewayForm
            mode={mode}
            gateway={gatewayQuery.data ?? null}
            agents={agentsQuery.data ?? []}
            models={modelsQuery.data ?? []}
            providers={providersQuery.data ?? []}
            onClose={onClose}
            onCreateAgent={onCreateAgent}
          />
        </FormBootstrap>
      </DialogContent>
    </Dialog>
  );
};
