import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Investigation } from './types/investigation.ts';

interface WorkspaceState {
  investigations: Investigation[];
  selectedId: string | null;
  loading: boolean;
  apiMode: 'connecting' | 'api' | 'local-demo';
}

const initialState: WorkspaceState = { investigations: [], selectedId: null, loading: true, apiMode: 'connecting' };

const workspaceSlice = createSlice({
  name: 'workspace', initialState,
  reducers: {
    setInvestigations(state, action: PayloadAction<Investigation[]>) {
      state.investigations = action.payload;
      if (state.selectedId && !action.payload.some(item => item.id === state.selectedId)) state.selectedId = null;
    },
    upsertInvestigation(state, action: PayloadAction<Investigation>) {
      const index = state.investigations.findIndex(item => item.id === action.payload.id);
      if (index < 0) state.investigations.unshift(action.payload); else state.investigations[index] = action.payload;
    },
    selectInvestigation(state, action: PayloadAction<string | null>) { state.selectedId = action.payload; },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
    setApiMode(state, action: PayloadAction<WorkspaceState['apiMode']>) { state.apiMode = action.payload; },
  },
});

export const { setInvestigations, upsertInvestigation, selectInvestigation, setLoading, setApiMode } = workspaceSlice.actions;
export const store = configureStore({ reducer: { workspace: workspaceSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
