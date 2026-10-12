import * as React from 'react';

import { ImageOff } from 'lucide-react';

import { useBlobImage } from '@/features/blob/queries/use-blob-image';
import { translate } from '@/shared/i18n/translate';
import { Dialog } from '@/shared/views/dialog';
import { DialogBody } from '@/shared/views/dialog-body';
import { DialogContent } from '@/shared/views/dialog-content';
import { DialogHeader } from '@/shared/views/dialog-header';
import { DialogTitle } from '@/shared/views/dialog-title';
import { Spinner } from '@/shared/views/spinner';

interface MessageToolImageProps {
  fileKey: string;
}

interface ImagePreviewDialogProps {
  dataUrl: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ImagePreviewDialog = ({
  dataUrl,
  isOpen,
  onOpenChange,
}: ImagePreviewDialogProps): React.ReactElement => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent size="lg" className="max-w-[90vw]">
      <DialogHeader>
        <DialogTitle>{translate('messages.toolImageDialogTitle')}</DialogTitle>
      </DialogHeader>
      <DialogBody className="flex items-center justify-center">
        <img
          src={dataUrl}
          alt={translate('messages.toolImageDialogTitle')}
          className="max-w-full max-h-[70vh] object-contain rounded-[8px]"
        />
      </DialogBody>
    </DialogContent>
  </Dialog>
);

export const MessageToolImage = ({ fileKey }: MessageToolImageProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { dataUrl, isLoading } = useBlobImage(fileKey);

  const handleClick = (): void => {
    if (dataUrl === null) {
      return;
    }
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div
        className="rounded-[8px] border border-default bg-panel h-24 w-32 flex items-center justify-center"
        title={fileKey}
      >
        <Spinner size={14} className="text-muted" />
      </div>
    );
  }

  if (dataUrl === null) {
    return (
      <div
        className="rounded-[8px] border border-default bg-panel h-24 w-32 flex items-center justify-center text-muted"
        title={fileKey}
        aria-label={translate('messages.toolImageMissing')}
      >
        <ImageOff size={18} strokeWidth={1.8} />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={translate('messages.toolImagePreview')}
        title={fileKey}
        className="rounded-[8px] border border-default bg-panel h-24 w-32 overflow-hidden p-0 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] transition-opacity"
      >
        <img
          src={dataUrl}
          alt={translate('messages.toolImagePreview')}
          className="h-full w-full object-cover"
        />
      </button>
      <ImagePreviewDialog dataUrl={dataUrl} isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
