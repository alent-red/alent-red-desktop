import * as React from 'react';

import type { Gateway } from '@/features/gateways/types/gateway';
import { DeleteGatewayDialog } from '@/features/gateways/views/delete-gateway-dialog';
import { GatewayFormDialog } from '@/features/gateways/views/gateway-form-dialog';
import { GatewaysManagementView } from '@/features/gateways/views/gateways-management-view';
import { translate } from '@/shared/i18n/translate';
import { assertNever } from '@/shared/lib/assert-never';
import { FormMode } from '@/shared/types/form-mode';
import { Dialog } from '@/shared/views/dialog';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { closeMainWindowDialog } from '@/windows/main-window/actions/close-main-window-dialog';
import { openCreateAgentDialog } from '@/windows/main-window/actions/open-create-agent-dialog';

type ManagerSubState =
  | { type: 'NONE' }
  | { type: 'CREATE' }
  | { type: 'EDIT'; gatewayId: string }
  | { type: 'DELETE'; gatewayId: string };

export const GatewaysManagerDialog = (): React.ReactElement => {
  const [sub, setSub] = React.useState<ManagerSubState>({ type: 'NONE' });

  const handleAdd = (): void => {
    setSub({ type: 'CREATE' });
  };

  const handleEdit = (id: string): void => {
    setSub({ type: 'EDIT', gatewayId: id });
  };

  const handleDelete = (gateway: Gateway): void => {
    setSub({ type: 'DELETE', gatewayId: gateway.id });
  };

  const handleSubClose = (): void => {
    setSub({ type: 'NONE' });
  };

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      closeMainWindowDialog();
    }
  };

  // Clicking "Create agent" from the gateway form closes the gateways manager
  // and routes to the agent form via the main-window dialog store. Same
  // trade-off as the brick selector's "Open settings" link from the agent
  // form (single-slot store).
  const handleCreateAgentFromGatewayForm = (): void => {
    closeMainWindowDialog();
    openCreateAgentDialog();
  };

  const renderSubDialog = (): React.ReactElement | null => {
    switch (sub.type) {
      case 'NONE':
        return null;
      case 'CREATE':
        return (
          <GatewayFormDialog
            mode={FormMode.Create}
            gatewayId={null}
            onClose={handleSubClose}
            onCreateAgent={handleCreateAgentFromGatewayForm}
          />
        );
      case 'EDIT':
        return (
          <GatewayFormDialog
            mode={FormMode.Edit}
            gatewayId={sub.gatewayId}
            onClose={handleSubClose}
            onCreateAgent={handleCreateAgentFromGatewayForm}
          />
        );
      case 'DELETE':
        return <DeleteGatewayDialog gatewayId={sub.gatewayId} onClose={handleSubClose} />;
      default:
        return assertNever(sub);
    }
  };

  return (
    <>
      <Dialog open onOpenChange={handleOpenChange}>
        <DialogContent
          size="lg"
          className="h-[min(85vh,640px)]"
          onOpenAutoFocus={(event): void => {
            event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>{translate('gateways.title')}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 flex flex-col pt-2">
            <GatewaysManagementView
              onAddGateway={handleAdd}
              onEditGateway={handleEdit}
              onDeleteGateway={handleDelete}
              headerTitle={null}
            />
          </div>
        </DialogContent>
      </Dialog>
      {renderSubDialog()}
    </>
  );
};
