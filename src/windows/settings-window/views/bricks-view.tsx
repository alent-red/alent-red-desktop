import * as React from 'react';

import type { Brick } from '@/features/bricks/types/brick';
import { BricksManagementView } from '@/features/bricks/views/bricks-management-view';
import { openCreateBrickDialog } from '@/windows/settings-window/actions/open-create-brick-dialog';
import { openDeleteBrickDialog } from '@/windows/settings-window/actions/open-delete-brick-dialog';
import { openEditBrickDialog } from '@/windows/settings-window/actions/open-edit-brick-dialog';

export const BricksView = (): React.ReactElement => {
  return (
    <BricksManagementView
      onAddBrick={openCreateBrickDialog}
      onEditBrick={openEditBrickDialog}
      onDeleteBrick={(brick: Brick): void => {
        openDeleteBrickDialog(brick.id);
      }}
    />
  );
};
