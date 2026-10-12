import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface MainWindowUiState {
  agentFilter: string | null;
  selectedConversationId: string | null;
  conversationsPanelWidth: number;
  isSidebarCollapsed: boolean;
  setAgentFilter: (filter: string | null) => void;
  setSelectedConversationId: (id: string | null) => void;
  setConversationsPanelWidth: (width: number) => void;
  setIsSidebarCollapsed: (isCollapsed: boolean) => void;
}

type MainWindowUiPersistedState = Pick<
  MainWindowUiState,
  'agentFilter' | 'selectedConversationId' | 'conversationsPanelWidth' | 'isSidebarCollapsed'
>;

const CONVERSATIONS_PANEL_MIN_WIDTH_PX = 240;
const CONVERSATIONS_PANEL_MAX_WIDTH_PX = 300;
const CONVERSATIONS_PANEL_DEFAULT_WIDTH_PX = 300;

const STORAGE_KEY = 'alent-red:main-window-ui';

function clampPanelWidth(width: number): number {
  return Math.min(
    CONVERSATIONS_PANEL_MAX_WIDTH_PX,
    Math.max(CONVERSATIONS_PANEL_MIN_WIDTH_PX, width),
  );
}

export const useMainWindowUiStore = create<MainWindowUiState>()(
  persist(
    (set): MainWindowUiState => ({
      agentFilter: null,
      selectedConversationId: null,
      conversationsPanelWidth: CONVERSATIONS_PANEL_DEFAULT_WIDTH_PX,
      isSidebarCollapsed: false,

      setAgentFilter: (filter): void => {
        set((state): MainWindowUiState | { agentFilter: string | null } => {
          if (state.agentFilter === filter) {
            return state;
          }
          return { agentFilter: filter };
        });
      },

      setSelectedConversationId: (id): void => {
        set({ selectedConversationId: id });
      },

      setConversationsPanelWidth: (width): void => {
        set({ conversationsPanelWidth: clampPanelWidth(width) });
      },

      setIsSidebarCollapsed: (isCollapsed): void => {
        set({ isSidebarCollapsed: isCollapsed });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage((): Storage => localStorage),
      partialize: (state): MainWindowUiPersistedState => ({
        agentFilter: state.agentFilter,
        selectedConversationId: state.selectedConversationId,
        conversationsPanelWidth: state.conversationsPanelWidth,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    },
  ),
);
