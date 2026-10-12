import * as React from 'react';

import { AutoTextarea } from '@/shared/views/auto-textarea';
import { FieldError } from '@/shared/views/field-error';

interface PreferenceStringFieldProps {
  value: string;
  error: string | null;
  isDisabled: boolean;
  onChange: (next: string) => void;
  onBlur: () => void;
}

export const PreferenceStringField = ({
  value,
  error,
  isDisabled,
  onChange,
  onBlur,
}: PreferenceStringFieldProps): React.ReactElement => {
  return (
    <>
      <AutoTextarea
        isResizable
        minRows={1}
        maxRows={10}
        value={value}
        onChange={(event): void => {
          onChange(event.target.value);
        }}
        onBlur={onBlur}
        isInvalid={Boolean(error)}
        disabled={isDisabled}
      />
      <FieldError message={error} />
    </>
  );
};
