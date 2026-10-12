import * as React from 'react';

import { MoreVertical } from 'lucide-react';

import { translate } from '@/shared/i18n/translate';
import { isWindowsPlatform } from '@/shared/lib/is-windows-platform';
import { DropdownMenu } from '@/shared/views/dropdown-menu';
import { DropdownMenuContent } from '@/shared/views/dropdown-menu-content';
import { DropdownMenuItem } from '@/shared/views/dropdown-menu-item';
import { DropdownMenuSeparator } from '@/shared/views/dropdown-menu-separator';
import { DropdownMenuTrigger } from '@/shared/views/dropdown-menu-trigger';
import { IconButton } from '@/shared/views/icon-button';

interface ConversationMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ConversationMenu = ({
  onEdit,
  onDelete,
}: ConversationMenuProps): React.ReactElement => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          ariaLabel={translate('conversations.actionsTooltip')}
          size={isWindowsPlatform() ? 'windowsCaption' : 'sm'}
        >
          <MoreVertical size={15} strokeWidth={2.1} />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={isWindowsPlatform() ? 0 : 6}>
        <DropdownMenuItem onSelect={onEdit}>{translate('conversations.edit')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={onDelete}>
          {translate('conversations.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
