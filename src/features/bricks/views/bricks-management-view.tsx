import * as React from 'react';

import { useBricks } from '@/features/bricks/queries/use-bricks';
import type { Brick } from '@/features/bricks/types/brick';
import { BricksList } from '@/features/bricks/views/bricks-list';
import { translate } from '@/shared/i18n/translate';
import { SectionBody } from '@/shared/views/section-body';
import { SectionHeader } from '@/shared/views/section-header';

export interface BricksManagementViewProps {
  onAddBrick: () => void;
  onEditBrick: (id: string) => void;
  onDeleteBrick: (brick: Brick) => void;
}

export const BricksManagementView = ({
  onAddBrick,
  onEditBrick,
  onDeleteBrick,
}: BricksManagementViewProps): React.ReactElement => {
  const { data: bricks = [], isLoading, isError, error, refetch, isFetching } = useBricks(null);
  const [query, setQuery] = React.useState('');

  const filteredBricks = React.useMemo((): Brick[] => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length === 0) {
      return bricks;
    }
    return bricks.filter((brick): boolean => brick.name.toLowerCase().includes(trimmed));
  }, [bricks, query]);

  const handleRefetch = React.useCallback((): void => {
    void refetch();
  }, [refetch]);

  const handleAdd = (): void => {
    onAddBrick();
  };

  const handleEdit = (id: string): void => {
    onEditBrick(id);
  };

  const handleDelete = (brick: Brick): void => {
    onDeleteBrick(brick);
  };

  const isRefreshing = isFetching && !isLoading;

  return (
    <div className="h-full flex flex-col">
      <SectionHeader
        title={translate('bricks.title')}
        search={{
          value: query,
          onChange: setQuery,
          placeholder: translate('bricks.searchPlaceholder'),
        }}
        onRefresh={handleRefetch}
        isRefreshing={isRefreshing}
        onAdd={handleAdd}
        addLabel={translate('bricks.addBrick')}
      />
      <SectionBody
        isLoading={isLoading}
        isError={isError}
        error={error}
        isFetching={isFetching}
        onRetry={handleRefetch}
      >
        <BricksList
          bricks={bricks}
          filteredBricks={filteredBricks}
          query={query}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </SectionBody>
    </div>
  );
};
