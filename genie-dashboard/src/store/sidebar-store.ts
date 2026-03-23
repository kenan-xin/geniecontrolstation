import { create } from "zustand";

interface SidebarState {
  expanded: boolean;
  mobileOpen: boolean;
  toggle: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  expanded: true,
  mobileOpen: false,
  toggle: () => set((state) => ({ expanded: !state.expanded })),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}));
