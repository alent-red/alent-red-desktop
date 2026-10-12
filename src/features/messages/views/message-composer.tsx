import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { FolderOpen, Paperclip, Send, Upload } from 'lucide-react';

import { conversationQueryKeys } from '@/features/conversations/queries/conversation-query-keys';
import { useSaveConversation } from '@/features/conversations/queries/use-save-conversation';
import type { Conversation } from '@/features/conversations/types/conversation';
import { computeConversationNameFromMessage } from '@/features/messages/lib/compute-conversation-name-from-message';
import { useSaveMessage } from '@/features/messages/queries/use-save-message';
import { MessageContextUsage } from '@/features/messages/views/message-context-usage';
import { toastDanger } from '@/features/toasts/actions/toast-danger';
import { toastError } from '@/features/toasts/actions/toast-error';
import { translate } from '@/shared/i18n/translate';
import { mergeClasses } from '@/shared/lib/merge-classes';
import { AutoTextarea } from '@/shared/views/auto-textarea';
import { DropdownMenu } from '@/shared/views/dropdown-menu';
import { DropdownMenuContent } from '@/shared/views/dropdown-menu-content';
import { DropdownMenuItem } from '@/shared/views/dropdown-menu-item';
import { DropdownMenuTrigger } from '@/shared/views/dropdown-menu-trigger';
import { IconButton } from '@/shared/views/icon-button';
import { PathChip } from '@/shared/views/path-chip';
import { Spinner } from '@/shared/views/spinner';
import { Tooltip } from '@/shared/views/tooltip';

interface MessageComposerProps {
  conversationId: string;
  contextTokensCount: number | null;
  contextWindowTokensCount: number | null;
}

const TEXTAREA_MIN_ROWS = 1;
const TEXTAREA_MAX_ROWS = 10;

export const MessageComposer = ({
  conversationId,
  contextTokensCount,
  contextWindowTokensCount,
}: MessageComposerProps): React.ReactElement => {
  const [text, setText] = React.useState('');
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const saveMessage = useSaveMessage();
  const saveConversation = useSaveConversation();
  const queryClient = useQueryClient();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect((): void => {
    textareaRef.current?.focus();
  }, []);

  const addPaths = React.useCallback((paths: string[]): void => {
    if (paths.length === 0) {
      return;
    }
    setAttachments((previous): string[] => Array.from(new Set([...previous, ...paths])));
  }, []);

  const canSend = text.trim().length > 0;

  const pickFiles = async (): Promise<void> => {
    try {
      const picked = await openFileDialog({ multiple: true, directory: false });
      if (picked === null) {
        return;
      }
      addPaths((Array.isArray(picked) ? picked : [picked]).map(String));
    } catch (caught) {
      toastError(caught);
    }
  };

  const pickFolder = async (): Promise<void> => {
    try {
      const picked = await openFileDialog({ multiple: true, directory: true });
      if (picked === null) {
        return;
      }
      addPaths((Array.isArray(picked) ? picked : [picked]).map(String));
    } catch (caught) {
      toastError(caught);
    }
  };

  const handlePickFiles = (): void => {
    void pickFiles();
  };

  const handlePickFolder = (): void => {
    void pickFolder();
  };

  const removeAttachment = (path: string): void => {
    setAttachments((previous): string[] =>
      previous.filter((existing): boolean => existing !== path),
    );
  };

  React.useEffect((): (() => void) => {
    const abortController = new AbortController();
    const { signal } = abortController;
    const isAborted = (): boolean => signal.aborted;
    let unlisten: (() => void) | null = null;

    getCurrentWebviewWindow()
      .onDragDropEvent((event): void => {
        const { payload } = event;
        if (payload.type === 'enter' || payload.type === 'over') {
          setIsDragOver(true);
          return;
        }
        setIsDragOver(false);
        if (payload.type === 'drop') {
          addPaths(payload.paths);
        }
      })
      .then((unlistener): void => {
        if (isAborted()) {
          unlistener();
          return;
        }
        unlisten = unlistener;
      })
      .catch((caught: unknown): void => {
        toastError(caught);
      });

    return (): void => {
      abortController.abort();
      if (unlisten !== null) {
        unlisten();
      }
    };
  }, [addPaths]);

  const send = async (): Promise<void> => {
    if (!canSend || isSubmitting) {
      return;
    }
    const trimmedText = text.trim();
    setIsSubmitting(true);
    try {
      const cachedConversation = queryClient.getQueryData<Conversation>(
        conversationQueryKeys.single(conversationId),
      );
      if (cachedConversation?.name === null) {
        if (cachedConversation.agentId === null || cachedConversation.agentId === '') {
          toastDanger(translate('conversations.pickAgent'));
          return;
        }
        const computedName = computeConversationNameFromMessage(trimmedText);
        try {
          await saveConversation.mutateAsync({
            input: { name: computedName, agentId: cachedConversation.agentId },
            id: conversationId,
          });
        } catch (caught) {
          toastError(caught);
          return;
        }
      }
      try {
        await saveMessage.mutateAsync({
          input: {
            text: trimmedText,
            attachedFilePaths: attachments,
            conversationId,
          },
          id: null,
        });
        setText('');
        setAttachments([]);
        textareaRef.current?.focus();
      } catch (caught) {
        toastError(caught);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSend = (): void => {
    void send();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key !== 'Enter') {
      return;
    }
    if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    event.preventDefault();
    void send();
  };

  return (
    <div className="px-4 sm:px-6 pt-2 pb-4">
      {isDragOver ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-overlay)] backdrop-blur-[2px]"
        >
          <div className="flex items-center gap-2.5 rounded-[14px] border-2 border-dashed border-[var(--color-brand)] bg-[var(--bg-surface)] px-6 py-4 text-[14px] font-medium text-primary shadow-[var(--shadow-lg)]">
            <Upload size={18} className="text-[var(--color-brand)]" />
            {translate('messages.dropToAttach')}
          </div>
        </div>
      ) : null}
      <div className="mx-auto max-w-[760px]">
        <div
          className={mergeClasses(
            'rounded-[14px] border border-default bg-input shadow-[var(--shadow-xs)]',
            'transition-shadow duration-[140ms] focus-within:border-[var(--color-brand)]',
          )}
        >
          {attachments.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
              {attachments.map(
                (path): React.ReactElement => (
                  <PathChip
                    key={path}
                    path={path}
                    isDisabled={isSubmitting}
                    onRemove={removeAttachment}
                  />
                ),
              )}
            </div>
          ) : null}
          <AutoTextarea
            ref={textareaRef}
            value={text}
            onChange={(event): void => {
              setText(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            minRows={TEXTAREA_MIN_ROWS}
            maxRows={TEXTAREA_MAX_ROWS}
            placeholder={translate('messages.inputPlaceholder')}
            className="border-0 focus:shadow-none focus:border-0 bg-transparent px-3 py-2.5"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <Tooltip content={translate('messages.attachTooltip')}>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      ariaLabel={translate('messages.attachTooltip')}
                      size="sm"
                      disabled={isSubmitting}
                    >
                      <Paperclip size={14} strokeWidth={1.9} />
                    </IconButton>
                  </DropdownMenuTrigger>
                </Tooltip>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem onSelect={handlePickFiles}>
                    <Paperclip size={13} strokeWidth={1.9} />
                    {translate('messages.attachFiles')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handlePickFolder}>
                    <FolderOpen size={13} strokeWidth={1.9} />
                    {translate('messages.attachFolder')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <MessageContextUsage
                usedTokensCount={contextTokensCount}
                windowTokensCount={contextWindowTokensCount}
              />
            </div>
            <Tooltip content={translate('messages.sendTooltip')}>
              <button
                type="button"
                aria-label={translate('messages.send')}
                onClick={handleSend}
                disabled={!canSend || isSubmitting}
                className={mergeClasses(
                  'inline-flex h-7 w-7 items-center justify-center rounded-[8px]',
                  'bg-[var(--color-brand)] text-[var(--color-brand-foreground)]',
                  'hover:bg-[var(--color-brand-hover)] active:translate-y-[0.5px]',
                  'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-brand)]',
                  'transition-all duration-[140ms]',
                )}
              >
                {isSubmitting ? (
                  <Spinner size={13} className="text-current" />
                ) : (
                  <Send size={13} strokeWidth={2.1} />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
