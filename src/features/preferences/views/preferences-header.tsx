import * as React from 'react';

import { RefreshCw, Save } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Button } from '@/shared/views/button';
import { IconButton } from '@/shared/views/icon-button';
import { Spinner } from '@/shared/views/spinner';
import { Tooltip } from '@/shared/views/tooltip';

interface PreferencesHeaderProps {
  isRefreshing: boolean;
  isSaving: boolean;
  onRefresh: () => void;
  onSave: () => void;
}

export const PreferencesHeader = ({
  isRefreshing,
  isSaving,
  onRefresh,
  onSave,
}: PreferencesHeaderProps): React.ReactElement => {
  return (
    <header className="flex items-center gap-2 px-6 pb-3 border-b border-subtle shrink-0">
      <h2 className="text-[14.5px] font-semibold tracking-tight shrink-0">
        {translate('preferences.title')}
      </h2>
      <div className="flex-1" />
      <Tooltip content={translate('common.refresh')}>
        <IconButton
          ariaLabel={translate('common.refresh')}
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            size={13}
            strokeWidth={2.1}
            className={mergeClasses(isRefreshing && 'animate-[spin_900ms_linear_infinite]')}
          />
        </IconButton>
      </Tooltip>
      <Button size="sm" onClick={onSave} disabled={isSaving}>
        {isSaving ? <Spinner size={13} className="text-current" /> : <Save size={13} />}
        {translate('preferences.saveChanges')}
      </Button>
    </header>
  );
};
