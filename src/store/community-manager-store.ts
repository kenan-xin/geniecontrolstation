import { create } from "zustand";

// Per-station playback/recording state
export interface StationPlaybackState {
  isPlaying: boolean;
  isRecording: boolean;
  status: string; // 'Ready' | 'Playing' | 'Paused' | 'Recording...' | 'Processing...'
  downloadUrl: string | null;
  isProcessing: boolean;
  recordingStartTime: number | null; // timestamp when recording started
}

const defaultStationState: StationPlaybackState = {
  isPlaying: false,
  isRecording: false,
  status: "Ready",
  downloadUrl: null,
  isProcessing: false,
  recordingStartTime: null,
};

interface CommunityManagerState {
  activeStationId: number | null;
  stationStates: Record<number, StationPlaybackState>;
  selectedSegmentIds: number[];
  page: number;
  rowsPerPage: number;

  // Actions
  setActiveStationId: (id: number | null) => void;
  getStationState: (id: number) => StationPlaybackState;
  updateStationState: (id: number, updates: Partial<StationPlaybackState>) => void;
  resetStationState: (id: number) => void;
  setSelectedSegmentIds: (ids: number[]) => void;
  toggleSegmentSelected: (id: number) => void;
  clearSegmentSelection: () => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}

export const useCommunityManagerStore = create<CommunityManagerState>(
  (set, get) => ({
    activeStationId: null,
    stationStates: {},
    selectedSegmentIds: [],
    page: 0,
    rowsPerPage: 10,

    setActiveStationId: (id) => {
      // Reset previous station state when switching
      const prevId = get().activeStationId;
      if (prevId !== null && prevId !== id) {
        get().resetStationState(prevId);
      }
      set({ activeStationId: id });
    },

    getStationState: (id) => {
      return get().stationStates[id] ?? { ...defaultStationState };
    },

    updateStationState: (id, updates) => {
      set((state) => ({
        stationStates: {
          ...state.stationStates,
          [id]: {
            ...state.stationStates[id] ?? defaultStationState,
            ...updates,
          },
        },
      }));
    },

    resetStationState: (id) => {
      set((state) => ({
        stationStates: {
          ...state.stationStates,
          [id]: { ...defaultStationState },
        },
      }));
    },

    setSelectedSegmentIds: (ids) => set({ selectedSegmentIds: ids }),

    toggleSegmentSelected: (id) =>
      set((state) => ({
        selectedSegmentIds: state.selectedSegmentIds.includes(id)
          ? state.selectedSegmentIds.filter((i) => i !== id)
          : [...state.selectedSegmentIds, id],
      })),

    clearSegmentSelection: () => set({ selectedSegmentIds: [] }),

    setPage: (page) => set({ page }),

    setRowsPerPage: (rows) => set({ rowsPerPage: rows, page: 0 }),
  })
);
