import * as React from 'react';

import { mergeClasses } from '@/shared/lib/merge-classes';

export const DialogForm = ({
  className,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>): React.ReactElement => {
  return <form className={mergeClasses('flex flex-col min-h-0 flex-1', className)} {...props} />;
};
