import * as React from 'react';

import { Plus, Save } from 'lucide-react';

import { FormMode } from '@/shared/types/form-mode';
import { Spinner } from '@/shared/views/spinner';

interface SubmitButtonContentProps {
  isPending: boolean;
  mode: FormMode;
}

export const SubmitButtonContent = ({
  isPending,
  mode,
}: SubmitButtonContentProps): React.ReactElement => {
  if (isPending) {
    return <Spinner size={13} className="text-current" />;
  }
  if (mode === FormMode.Create) {
    return <Plus size={13} />;
  }
  return <Save size={13} />;
};
