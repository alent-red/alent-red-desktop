import * as React from 'react';

import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { Label } from '@/shared/views/label';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
  onBlur?: () => void;
  error?: string | null;
  isDisabled?: boolean;
}

export const NumberField = ({
  label,
  value,
  onChange,
  onBlur,
  error = null,
  isDisabled = false,
}: NumberFieldProps): React.ReactElement => {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input
        type="number"
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
    </div>
  );
};
