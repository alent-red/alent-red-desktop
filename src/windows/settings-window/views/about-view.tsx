import * as React from 'react';

import { getVersion } from '@tauri-apps/api/app';
import { RefreshCw } from 'lucide-react';

import { openUpdateDialog } from '@/features/about/actions/open-update-dialog';
import { runUpdateCheck } from '@/features/about/actions/run-update-check';
import { useAboutStore, type AboutState } from '@/features/about/stores/about-store';
import { toastError } from '@/features/toasts/actions/toast-error';
import { toastSuccess } from '@/features/toasts/actions/toast-success';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Logo } from '@/shared/views/logo';

const ONE_MINUTE_MS = 60 * 1000;
const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

function formatTimeAgo(timestamp: number): string {
  if (timestamp <= 0) {
    return translate('about.neverChecked');
  }
  const elapsed = Date.now() - timestamp;
  if (elapsed < ONE_MINUTE_MS) {
    return translate('about.justNow');
  }
  if (elapsed < ONE_HOUR_MS) {
    const minutes = Math.floor(elapsed / ONE_MINUTE_MS);
    return translate('about.minutesAgo', { count: minutes });
  }
  if (elapsed < ONE_DAY_MS) {
    const hours = Math.floor(elapsed / ONE_HOUR_MS);
    return translate('about.hoursAgo', { count: hours });
  }
  const days = Math.floor(elapsed / ONE_DAY_MS);
  return translate('about.daysAgo', { count: days });
}

export const AboutView = (): React.ReactElement => {
  const [appVersion, setAppVersion] = React.useState<string | null>(null);
  const isChecking = useAboutStore(
    (state: AboutState): AboutState['isChecking'] => state.isChecking,
  );
  const lastCheckAt = useAboutStore(
    (state: AboutState): AboutState['lastCheckAt'] => state.lastCheckAt,
  );

  const handleCheck = (): void => {
    runUpdateCheck({ ignoreCadence: true })
      .then((result): void => {
        if (result.found !== null) {
          openUpdateDialog();
          return;
        }
        if (!result.skipped) {
          toastSuccess(
            translate('about.upToDateTitle'),
            translate('about.upToDateBody', { version: appVersion ?? '' }),
          );
        }
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });
  };

  React.useEffect((): void => {
    getVersion()
      .then((version): void => {
        setAppVersion(version);
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between px-6 pb-3 border-b border-subtle">
        <h2 className="text-[14.5px] font-semibold tracking-tight">{translate('about.title')}</h2>
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto flex max-w-[440px] flex-col items-center gap-5 px-8 py-10 text-center">
          <Logo size={48} />
          <div className="text-[12.5px] text-muted">
            {appVersion === null
              ? translate('common.loading')
              : translate('about.versionLabel', { version: appVersion })}
          </div>
          <Button
            variant="secondary"
            onClick={handleCheck}
            disabled={isChecking}
            className="gap-1.5"
          >
            <RefreshCw size={13} className={isChecking ? 'animate-spin' : ''} />
            {isChecking ? translate('about.checkingButton') : translate('about.checkButton')}
          </Button>
          <div className="text-[11.5px] text-muted">
            {translate('about.lastCheckedLabel', { when: formatTimeAgo(lastCheckAt) })}
          </div>
        </div>
      </div>
      <footer className="flex flex-col items-center gap-1.5 border-t border-subtle px-6 py-4 text-center">
        <div className="text-[11px] text-muted">
          {translate('about.copyright', { year: String(new Date().getFullYear()) })}
        </div>
      </footer>
    </div>
  );
};
