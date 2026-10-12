import * as React from 'react';

import type { Brick } from '@/features/bricks/types/brick';
import { BrickRow } from '@/features/bricks/views/brick-row';
import { BricksEmptyState } from '@/features/bricks/views/bricks-empty-state';
import { translate } from '@/shared/i18n/translate';

interface BricksListProps {
  bricks: Brick[];
  filteredBricks: Brick[];
  query: string;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (brick: Brick) => void;
}

export const BricksList = ({
  bricks,
  filteredBricks,
  query,
  onAdd,
  onEdit,
  onDelete,
}: BricksListProps): React.ReactElement => {
  if (bricks.length === 0) {
    return <BricksEmptyState onAdd={onAdd} />;
  }
  if (filteredBricks.length === 0) {
    return (
      <div className="text-muted text-[12.5px] text-center py-8">
        {translate('bricks.noBricksMatching', { query: query.trim() })}
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {filteredBricks.map(
        (brick): React.ReactElement => (
          <BrickRow key={brick.id} brick={brick} onEdit={onEdit} onDelete={onDelete} />
        ),
      )}
    </ul>
  );
};
