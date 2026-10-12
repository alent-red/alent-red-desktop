import * as React from 'react';

import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';

interface PreferenceIntFieldProps {
  value: number;
  error: string | null;
  isDisabled: boolean;
  onChange: (next: number) => void;
  onBlur: () => void;
}

export const PreferenceIntField = ({
  value,
  error,
  isDisabled,
  onChange,
  onBlur,
}: PreferenceIntFieldProps): React.ReactElement => {
  return (
    <>
      <Input
        type="number"
        value={String(value)}
        onChange={(event): void => {
          const raw = event.target.value;
          onChange(Math.floor(Number(raw.length > 0 ? raw : 0)));
        }}
        onBlur={onBlur}
        isInvalid={Boolean(error)}
        disabled={isDisabled}
      />
      <FieldError message={error} />
    </>
  );
};
