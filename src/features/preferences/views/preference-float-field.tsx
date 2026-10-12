import * as React from 'react';

import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';

interface PreferenceFloatFieldProps {
  value: number;
  error: string | null;
  isDisabled: boolean;
  onChange: (next: number) => void;
  onBlur: () => void;
}

export const PreferenceFloatField = ({
  value,
  error,
  isDisabled,
  onChange,
  onBlur,
}: PreferenceFloatFieldProps): React.ReactElement => {
  return (
    <>
      <Input
        type="number"
        step="0.01"
        value={String(value)}
        onChange={(event): void => {
          const raw = event.target.value;
          onChange(Number(raw.length > 0 ? raw : 0));
        }}
        onBlur={onBlur}
        isInvalid={Boolean(error)}
        disabled={isDisabled}
      />
      <FieldError message={error} />
    </>
  );
};
