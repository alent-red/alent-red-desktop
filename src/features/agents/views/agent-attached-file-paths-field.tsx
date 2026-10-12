import * as React from 'react';

import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { FolderOpen, Paperclip } from 'lucide-react';

import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { Label } from '@/shared/views/label';
import { PathChip } from '@/shared/views/path-chip';

interface AgentAttachedFilePathsFieldProps {
  paths: string[];
  isDisabled: boolean;
  onChange: (paths: string[]) => void;
}

export const AgentAttachedFilePathsField = ({
  paths,
  isDisabled,
  onChange,
}: AgentAttachedFilePathsFieldProps): React.ReactElement => {
  const addPaths = (picked: string | string[] | null): void => {
    if (picked === null) {
      return;
    }
    const next = (Array.isArray(picked) ? picked : [picked]).map(String);
    onChange(Array.from(new Set([...paths, ...next])));
  };

  const pickFiles = async (): Promise<void> => {
    try {
      addPaths(await openFileDialog({ multiple: true, directory: false }));
    } catch (caught) {
      toastError(caught);
    }
  };

  const pickFolders = async (): Promise<void> => {
    try {
      addPaths(await openFileDialog({ multiple: true, directory: true }));
    } catch (caught) {
      toastError(caught);
    }
  };

  const removePath = (path: string): void => {
    onChange(paths.filter((existing): boolean => existing !== path));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{translate('agents.attachedFilePathsLabel')}</Label>
      {paths.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {paths.map(
            (path): React.ReactElement => (
              <PathChip key={path} path={path} isDisabled={isDisabled} onRemove={removePath} />
            ),
          )}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(): void => {
            void pickFiles();
          }}
          disabled={isDisabled}
        >
          <Paperclip size={13} />
          {translate('agents.attachFiles')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(): void => {
            void pickFolders();
          }}
          disabled={isDisabled}
        >
          <FolderOpen size={13} />
          {translate('agents.attachFolder')}
        </Button>
      </div>
    </div>
  );
};
