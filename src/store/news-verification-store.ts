import { create } from "zustand";

interface NewsVerificationState {
  selectedIds: number[];
  searchQuery: string;
  statusFilter: string | null;
  page: number;
  rowsPerPage: number;
  setSelectedIds: (ids: number[]) => void;
  toggleSelected: (id: number) => void;
  selectAll: (ids: number[]) => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string | null) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
}

export const useNewsVerificationStore = create<NewsVerificationState>(
  (set) => ({
    selectedIds: [],
    searchQuery: "",
    statusFilter: null,
    page: 0,
    rowsPerPage: 10,
    setSelectedIds: (ids) => set({ selectedIds: ids }),
    toggleSelected: (id) =>
      set((state) => ({
        selectedIds: state.selectedIds.includes(id)
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id],
      })),
    selectAll: (ids) => set({ selectedIds: ids }),
    clearSelection: () => set({ selectedIds: [] }),
    setSearchQuery: (query) => set({ searchQuery: query, page: 0 }),
    setStatusFilter: (status) => set({ statusFilter: status, page: 0 }),
    setPage: (page) => set({ page }),
    setRowsPerPage: (rows) => set({ rowsPerPage: rows, page: 0 }),
  })
);
