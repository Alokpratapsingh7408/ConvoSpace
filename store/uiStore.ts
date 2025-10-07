import { create } from "zustand";

interface UIState {
  theme: "light" | "dark" | "system";
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "system",
  isSidebarOpen: true,
  isModalOpen: false,
  modalContent: null,

  setTheme: (theme) => set({ theme }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),

  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
