import * as React from 'react';

import { Plus, X } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { FieldError } from '@/shared/views/field-error';
import { IconButton } from '@/shared/views/icon-button';
import { Input } from '@/shared/views/input';

export interface AllowedUserNameEntry {
  id: string;
  value: string;
  error: string | null;
  isTouched: boolean;
}

interface GatewayAllowedUserNamesListProps {
  entries: AllowedUserNameEntry[];
  isPending: boolean;
  onChangeEntry: (id: string, value: string) => void;
  onBlurEntry: (id: string) => void;
  onAddEntry: () => void;
  onRemoveEntry: (id: string) => void;
}

export const GatewayAllowedUserNamesList = ({
  entries,
  isPending,
  onChangeEntry,
  onBlurEntry,
  onAddEntry,
  onRemoveEntry,
}: GatewayAllowedUserNamesListProps): React.ReactElement => {
  return (
    <div className="flex flex-col gap-2">
      {entries.map(
        (entry): React.ReactElement => (
          <div key={entry.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <Input
                  value={entry.value}
                  onChange={(event): void => {
                    onChangeEntry(entry.id, event.target.value);
                  }}
                  onBlur={(): void => {
                    onBlurEntry(entry.id);
                  }}
                  placeholder={translate('gateways.allowedUserNamesPlaceholder')}
                  isInvalid={entry.isTouched ? entry.error !== null : false}
                  disabled={isPending}
                />
              </div>
              <IconButton
                ariaLabel={translate('gateways.allowedUserNameRemove')}
                size="md"
                onClick={(): void => {
                  onRemoveEntry(entry.id);
                }}
                disabled={isPending}
              >
                <X size={13} />
              </IconButton>
            </div>
            <FieldError message={entry.isTouched ? entry.error : null} />
          </div>
        ),
      )}
      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onAddEntry}
          disabled={isPending}
        >
          <Plus size={13} />
          {translate('gateways.allowedUserNamesAdd')}
        </Button>
      </div>
    </div>
  );
};
