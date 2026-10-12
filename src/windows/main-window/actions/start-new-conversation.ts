import { agentsApi } from '@/features/agents/apis/agents-api';
import { conversationsApi } from '@/features/conversations/apis/conversations-api';
import { toastError } from '@/features/toasts/actions/toast-error';
import { openNewConversationDialog } from '@/windows/main-window/actions/open-new-conversation-dialog';
import { useMainWindowUiStore } from '@/windows/main-window/stores/main-window-ui-store';

let isStarting = false;

// With a single agent there is nothing to ask: the conversation is created
// right away. Otherwise the dialog opens so the user picks an agent.
export async function startNewConversation(presetAgentId: string | null): Promise<void> {
  if (isStarting) {
    return;
  }
  isStarting = true;
  try {
    const agents = await agentsApi.getAll();
    const onlyAgent = agents.length === 1 ? agents[0] : undefined;
    if (onlyAgent === undefined) {
      openNewConversationDialog(presetAgentId);
      return;
    }
    const conversation = await conversationsApi.save({ name: null, agentId: onlyAgent.id }, null);
    useMainWindowUiStore.getState().setSelectedConversationId(conversation.id);
  } catch (caught) {
    toastError(caught);
  } finally {
    isStarting = false;
  }
}
