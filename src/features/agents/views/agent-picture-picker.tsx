import * as React from 'react';

import { Camera, Trash2 } from 'lucide-react';

import { AVATAR_OUTPUT_MIME_TYPE } from '@/features/agents/lib/avatar-output-mime-type';
import { encodeAvatarFileAsBase64 } from '@/features/agents/lib/encode-avatar-file-as-base64';
import { AgentAvatar } from '@/features/agents/views/agent-avatar';
import { blobApi } from '@/features/blob/apis/blob-api';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { Spinner } from '@/shared/views/spinner';

interface AgentPicturePickerProps {
  name: string;
  pictureFileKey: string | null;
  size?: number;
  onChange: (pictureFileKey: string | null) => void;
  disabled?: boolean;
}

const ACCEPTED_FILE_TYPES = 'image/png,image/jpeg,image/webp,image/gif';

export const AgentPicturePicker = ({
  name,
  pictureFileKey,
  size = 72,
  onChange,
  disabled,
}: AgentPicturePickerProps): React.ReactElement => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const isLocked = isUploading || disabled === true;
  const hasPicture = pictureFileKey !== null && pictureFileKey.length > 0;
  const displayName = name.length > 0 ? name : '?';

  const openFilePicker = (): void => {
    inputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file === undefined) {
      return;
    }
    setIsUploading(true);
    try {
      const contentBase64 = await encodeAvatarFileAsBase64(file);
      const key = await blobApi.save({
        contentBase64,
        contentType: AVATAR_OUTPUT_MIME_TYPE,
        fileName: null,
      });
      onChange(key);
    } catch (caught) {
      toastError(caught);
    } finally {
      setIsUploading(false);
    }
  };

  const removePicture = (): void => {
    onChange(null);
  };

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        className="hidden"
        onChange={(event): void => {
          void handleFileSelected(event);
        }}
      />
      <button
        type="button"
        onClick={openFilePicker}
        disabled={isLocked}
        className={mergeClasses(
          'group relative inline-flex items-center justify-center rounded-full',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]',
          'disabled:cursor-not-allowed',
        )}
        style={{ width: size, height: size }}
        aria-label={hasPicture ? translate('agents.changePicture') : translate('agents.addPicture')}
      >
        <AgentAvatar name={displayName} pictureFileKey={pictureFileKey} size={size} />
        <span
          aria-hidden
          className={mergeClasses(
            'absolute inset-0 rounded-full flex items-center justify-center',
            'bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity',
            isUploading && 'opacity-100',
          )}
        >
          {isUploading ? (
            <Spinner size={18} className="text-white" />
          ) : (
            <Camera size={18} strokeWidth={2} />
          )}
        </span>
      </button>
      {hasPicture && !isLocked ? (
        <button
          type="button"
          onClick={removePicture}
          aria-label={translate('agents.removePicture')}
          className={mergeClasses(
            'absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full',
            'bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--color-danger)]',
            'shadow-[var(--shadow-sm)]',
            'hover:bg-[var(--bg-hover)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
          )}
        >
          <Trash2 size={11} strokeWidth={2.2} />
        </button>
      ) : null}
    </div>
  );
};
