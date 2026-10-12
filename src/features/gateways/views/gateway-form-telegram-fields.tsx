import * as React from 'react';

import {
  GatewayAllowedUserNamesList,
  type AllowedUserNameEntry,
} from '@/features/gateways/views/gateway-allowed-user-names-list';
import { translate } from '@/shared/i18n/translate';
import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { Label } from '@/shared/views/label';
import { Switch } from '@/shared/views/switch';

interface GatewayFormTelegramFieldsProps {
  token: string;
  tokenError: string | null;
  allowAll: boolean;
  allowedUserNameEntries: AllowedUserNameEntry[];
  isPending: boolean;
  onTokenChange: (next: string) => void;
  onTokenBlur: () => void;
  onAllowAllChange: (next: boolean) => void;
  onAllowedUserNameEntryChange: (id: string, value: string) => void;
  onAllowedUserNameEntryBlur: (id: string) => void;
  onAllowedUserNameEntryAdd: () => void;
  onAllowedUserNameEntryRemove: (id: string) => void;
}

export const GatewayFormTelegramFields = ({
  token,
  tokenError,
  allowAll,
  allowedUserNameEntries,
  isPending,
  onTokenChange,
  onTokenBlur,
  onAllowAllChange,
  onAllowedUserNameEntryChange,
  onAllowedUserNameEntryBlur,
  onAllowedUserNameEntryAdd,
  onAllowedUserNameEntryRemove,
}: GatewayFormTelegramFieldsProps): React.ReactElement => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label htmlFor="gateway-token">{translate('gateways.tokenLabel')}</Label>
        <Input
          id="gateway-token"
          type="password"
          value={token}
          onChange={(event): void => {
            onTokenChange(event.target.value);
          }}
          onBlur={onTokenBlur}
          isInvalid={Boolean(tokenError)}
          disabled={isPending}
        />
        <FieldError message={tokenError} />
      </div>

      <div className="flex items-start justify-between gap-3 py-1">
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="text-[13px] font-medium text-primary">
            {translate('gateways.allowAllLabel')}
          </div>
          <div className="text-[12px] text-muted leading-snug">
            {translate('gateways.allowAllDescription')}
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          <Switch
            checked={allowAll}
            onCheckedChange={onAllowAllChange}
            disabled={isPending}
            aria-label={translate('gateways.allowAllLabel')}
          />
        </div>
      </div>

      {allowAll ? null : (
        <div className="flex flex-col gap-1.5">
          <Label>{translate('gateways.allowedUserNamesLabel')}</Label>
          <GatewayAllowedUserNamesList
            entries={allowedUserNameEntries}
            isPending={isPending}
            onChangeEntry={onAllowedUserNameEntryChange}
            onBlurEntry={onAllowedUserNameEntryBlur}
            onAddEntry={onAllowedUserNameEntryAdd}
            onRemoveEntry={onAllowedUserNameEntryRemove}
          />
        </div>
      )}
    </>
  );
};
