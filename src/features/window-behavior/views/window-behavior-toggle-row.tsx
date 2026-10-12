import * as React from 'react';

import { Switch } from '@/shared/views/switch';
import { Tooltip } from '@/shared/views/tooltip';

interface WindowBehaviorToggleRowProps {
  label: string;
  description: string;
  isChecked: boolean;
  isDisabled?: boolean;
  disabledTooltip?: string;
  onChange: (next: boolean) => void;
}

export const WindowBehaviorToggleRow = ({
  label,
  description,
  isChecked,
  isDisabled = false,
  disabledTooltip,
  onChange,
}: WindowBehaviorToggleRowProps): React.ReactElement => {
  const handleChange = (next: boolean): void => {
    onChange(next);
  };

  const renderedSwitch = (
    <Switch
      checked={isChecked}
      onCheckedChange={handleChange}
      disabled={isDisabled}
      aria-label={label}
    />
  );

  const switchSlot =
    isDisabled && disabledTooltip !== undefined ? (
      <Tooltip content={disabledTooltip} side="left">
        <span className="inline-flex">{renderedSwitch}</span>
      </Tooltip>
    ) : (
      renderedSwitch
    );

  return (
    <div className="flex items-start justify-between gap-3 py-2.5 first:pt-0">
      <div className="min-w-0 flex flex-col gap-0.5">
        <div className="text-[13px] font-medium text-primary">{label}</div>
        <div className="text-[12px] text-muted leading-snug">{description}</div>
      </div>
      <div className="shrink-0 pt-0.5">{switchSlot}</div>
    </div>
  );
};
