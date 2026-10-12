import * as React from 'react';

import { Gift, X } from 'lucide-react';

import { dismissFab } from '@/features/about/actions/dismiss-fab';
import { openUpdateDialog } from '@/features/about/actions/open-update-dialog';
import { useAboutStore, type AboutState } from '@/features/about/stores/about-store';
import { translate } from '@/shared/i18n/translate';

export const UpdateFab = (): React.ReactElement | null => {
  const pendingUpdate = useAboutStore(
    (state: AboutState): AboutState['pendingUpdate'] => state.pendingUpdate,
  );
  const isFabDismissed = useAboutStore(
    (state: AboutState): AboutState['isFabDismissed'] => state.isFabDismissed,
  );

  const handleOpen = (): void => {
    openUpdateDialog();
  };

  const handleDismiss = (): void => {
    dismissFab();
  };

  if (pendingUpdate === null) {
    return null;
  }
  if (isFabDismissed) {
    return null;
  }

  return (
    <div className="absolute bottom-4 left-4 z-50 flex items-center gap-1 rounded-[10px] border border-subtle bg-surface pl-1 pr-1 py-1 shadow-lg">
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-[8px] px-2 py-1.5 transition-colors duration-[140ms] hover:bg-[var(--bg-hover)]"
        aria-label={translate('about.updateFabLabel', { version: pendingUpdate.version })}
      >
        <Gift size={16} className="text-brand" aria-hidden />
        <span className="text-[12.5px] font-medium text-primary">
          {translate('about.updateAvailable', { version: pendingUpdate.version })}
        </span>
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex h-7 w-7 items-center justify-center rounded-[6px] text-muted transition-colors hover:bg-[var(--bg-hover)] hover:text-primary"
        aria-label={translate('about.dismissFabLabel')}
      >
        <X size={12} aria-hidden />
      </button>
    </div>
  );
};
