import * as React from 'react';

import { CACHE_TTL_PREFERENCE_OPTIONS } from '@/features/preferences/constants/cache-ttl-preference-options';
import { translate } from '@/shared/i18n/translate';
import { Select } from '@/shared/views/select';
import { SelectContent } from '@/shared/views/select-content';
import { SelectItem } from '@/shared/views/select-item';
import { SelectTrigger } from '@/shared/views/select-trigger';
import { SelectValue } from '@/shared/views/select-value';

interface PreferenceCacheTtlFieldProps {
  value: string;
  isDisabled: boolean;
  onChange: (next: string) => void;
}

export const PreferenceCacheTtlField = ({
  value,
  isDisabled,
  onChange,
}: PreferenceCacheTtlFieldProps): React.ReactElement => {
  return (
    <Select
      value={value}
      onValueChange={(next): void => {
        onChange(next);
      }}
      disabled={isDisabled}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CACHE_TTL_PREFERENCE_OPTIONS.map(
          (option): React.ReactElement => (
            <SelectItem key={option.value} value={option.value}>
              {translate(option.labelKey)}
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  );
};
