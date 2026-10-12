import * as React from 'react';

import { Switch } from '@/shared/views/switch';

interface PreferenceBoolFieldProps {
  value: boolean;
  isDisabled: boolean;
  onChange: (next: boolean) => void;
}

export const PreferenceBoolField = ({
  value,
  isDisabled,
  onChange,
}: PreferenceBoolFieldProps): React.ReactElement => {
  return (
    <Switch
      checked={value}
      onCheckedChange={(checked): void => {
        onChange(checked);
      }}
      disabled={isDisabled}
    />
  );
};
