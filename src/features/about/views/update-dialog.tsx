import * as React from 'react';

import { Download, RefreshCw } from 'lucide-react';

import { closeUpdateDialog } from '@/features/about/actions/close-update-dialog';
import { installPendingUpdate } from '@/features/about/actions/install-pending-update';
import { restartAfterInstall } from '@/features/about/actions/restart-after-install';
import { InstallPhase, useAboutStore, type AboutState } from '@/features/about/stores/about-store';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Dialog } from '@/shared/views/dialog';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogFooter } from '@/shared/views/dialog-footer';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { MarkdownText } from '@/shared/views/markdown-text';

function computePercent(downloaded: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(100, Math.floor((downloaded / total) * 100));
}

function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return '0 MB';
  }
  const megabytes = bytes / (1024 * 1024);
  return `${megabytes.toFixed(1)} MB`;
}

export const UpdateDialog = (): React.ReactElement | null => {
  const pendingUpdate = useAboutStore(
    (state: AboutState): AboutState['pendingUpdate'] => state.pendingUpdate,
  );
  const isDialogOpen = useAboutStore(
    (state: AboutState): AboutState['isDialogOpen'] => state.isDialogOpen,
  );
  const installPhase = useAboutStore(
    (state: AboutState): AboutState['installPhase'] => state.installPhase,
  );
  const downloadedBytes = useAboutStore(
    (state: AboutState): AboutState['downloadedBytes'] => state.downloadedBytes,
  );
  const totalBytes = useAboutStore(
    (state: AboutState): AboutState['totalBytes'] => state.totalBytes,
  );

  const handleOpenChange = (nextOpen: boolean): void => {
    if (!nextOpen) {
      closeUpdateDialog();
    }
  };

  const handleCancel = (): void => {
    closeUpdateDialog();
  };

  const handleInstall = (): void => {
    installPendingUpdate().catch((caught: unknown): void => {
      toastError(caught);
    });
  };

  const handleRestart = (): void => {
    restartAfterInstall().catch((caught: unknown): void => {
      toastError(caught);
    });
  };

  if (pendingUpdate === null) {
    return null;
  }

  const isDownloading = installPhase === InstallPhase.Downloading;
  const isInstalling = installPhase === InstallPhase.Installing;
  const isReadyToRestart = installPhase === InstallPhase.ReadyToRestart;
  const isIdle = installPhase === InstallPhase.Idle;
  const progressPercent = computePercent(downloadedBytes, totalBytes);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="lg" showClose={isIdle}>
        <DialogHeader>
          <DialogTitle>
            {translate('about.updateDialogTitle', { version: pendingUpdate.version })}
          </DialogTitle>
          <p className="text-[12.5px] text-muted">
            {translate('about.updateDialogSubtitle', {
              currentVersion: pendingUpdate.currentVersion,
            })}
          </p>
        </DialogHeader>

        <DialogBody>
          {isIdle ? (
            <MarkdownText className="text-[13px] text-primary">
              {pendingUpdate.notes ?? translate('about.noReleaseNotes')}
            </MarkdownText>
          ) : null}

          {isDownloading ? (
            <div className="flex flex-col gap-3 py-4">
              <div className="flex items-center justify-between text-[12.5px] text-secondary">
                <span>{translate('about.downloadingLabel')}</span>
                <span>
                  {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)} (
                  {String(progressPercent)}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-active)]">
                <div
                  className="h-full bg-brand transition-[width] duration-[200ms]"
                  style={{ width: `${String(progressPercent)}%` }}
                />
              </div>
            </div>
          ) : null}

          {isInstalling ? (
            <div className="flex items-center justify-center gap-2 py-6 text-[13px] text-secondary">
              <RefreshCw size={14} className="animate-spin" />
              <span>{translate('about.installingLabel')}</span>
            </div>
          ) : null}

          {isReadyToRestart ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <p className="text-[14px] font-medium text-primary">
                {translate('about.installedTitle', { version: pendingUpdate.version })}
              </p>
              <p className="text-[12.5px] text-muted">{translate('about.installedSubtitle')}</p>
            </div>
          ) : null}
        </DialogBody>

        <DialogFooter>
          {isIdle ? (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                {translate('common.cancel')}
              </Button>
              <Button variant="primary" onClick={handleInstall}>
                <Download size={14} />
                {translate('about.installButton')}
              </Button>
            </>
          ) : null}

          {isDownloading ? (
            <Button variant="ghost" onClick={handleCancel}>
              {translate('common.cancel')}
            </Button>
          ) : null}

          {isReadyToRestart ? (
            <>
              <Button variant="ghost" onClick={handleCancel}>
                {translate('about.restartLaterButton')}
              </Button>
              <Button variant="primary" onClick={handleRestart}>
                {translate('about.restartNowButton')}
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
