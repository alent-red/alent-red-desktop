import * as React from 'react';

import { AlertCircle } from 'lucide-react';

interface FieldErrorProps {
  message: string | null;
}

export const FieldError = ({ message }: FieldErrorProps): React.ReactElement | null => {
  if (message === null || message.length === 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-1 text-[11px] text-[var(--color-danger)] mt-0.5">
      <AlertCircle size={11} strokeWidth={2.2} />
      <span>{message}</span>
    </div>
  );
};
