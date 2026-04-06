import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  notificationPanelOpen: boolean;
  aiPanelOpen: boolean;
  activeWorkspaceSlug: string | null;
  activeProjectId: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  commandPaletteOpen: false,
  notificationPanelOpen: false,
  aiPanelOpen: false,
  activeWorkspaceSlug: null,
  activeProjectId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, action: PayloadAction<boolean>) { state.sidebarOpen = action.payload; },
    toggleCommandPalette(state) { state.commandPaletteOpen = !state.commandPaletteOpen; },
    setCommandPaletteOpen(state, action: PayloadAction<boolean>) { state.commandPaletteOpen = action.payload; },
    toggleNotificationPanel(state) { state.notificationPanelOpen = !state.notificationPanelOpen; },
    setNotificationPanelOpen(state, action: PayloadAction<boolean>) { state.notificationPanelOpen = action.payload; },
    toggleAiPanel(state) { state.aiPanelOpen = !state.aiPanelOpen; },
    setActiveWorkspace(state, action: PayloadAction<string>) { state.activeWorkspaceSlug = action.payload; },
    setActiveProject(state, action: PayloadAction<string>) { state.activeProjectId = action.payload; },
  },
});

export const {
  toggleSidebar, setSidebarOpen,
  toggleCommandPalette, setCommandPaletteOpen,
  toggleNotificationPanel, setNotificationPanelOpen,
  toggleAiPanel,
  setActiveWorkspace, setActiveProject,
} = uiSlice.actions;
export default uiSlice.reducer;