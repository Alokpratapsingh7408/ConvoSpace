import { create } from "zustand";

interface UIState {
  theme: "light" | "dark" | "system";
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  isMobileChatWindowOpen: boolean;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setMobileChatWindowOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "system",
  isSidebarOpen: true,
  isModalOpen: false,
  modalContent: null,
  isMobileChatWindowOpen: false,

  setTheme: (theme) => set({ theme }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  openModal: (content) => set({ isModalOpen: true, modalContent: content }),

  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  setMobileChatWindowOpen: (isOpen) => set({ isMobileChatWindowOpen: isOpen }),
}));
