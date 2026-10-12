import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { TooltipContent } from '@/shared/views/tooltip-content';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}

export const Tooltip = ({
  content,
  children,
  side = 'right',
  align = 'center',
  delayDuration = 200,
}: TooltipProps): React.ReactElement => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration} skipDelayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipContent side={side} align={align}>
          {content}
        </TooltipContent>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
