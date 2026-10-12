import * as React from 'react';

import { FolderOpen } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { Button } from '@/shared/views/button';
import { FieldError } from '@/shared/views/field-error';
import { Input } from '@/shared/views/input';
import { Label } from '@/shared/views/label';

interface BrickFormCustomFieldsProps {
  customPath: string;
  customPathError: string | null;
  isPending: boolean;
  onPickPath: () => void;
}

export const BrickFormCustomFields = ({
  customPath,
  customPathError,
  isPending,
  onPickPath,
}: BrickFormCustomFieldsProps): React.ReactElement => {
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="brick-custom-path">{translate('bricks.pathLabel')}</Label>
      <div className="flex gap-2">
        <Input
          id="brick-custom-path"
          value={customPath}
          readOnly
          placeholder=""
          isInvalid={Boolean(customPathError)}
          className="cursor-default"
          disabled={isPending}
        />
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={onPickPath}
          disabled={isPending}
        >
          <FolderOpen size={13} />
          {translate('common.browse')}
        </Button>
      </div>
      <FieldError message={customPathError} />
    </div>
  );
};
