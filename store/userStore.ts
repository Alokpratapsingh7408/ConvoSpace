import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/chat";

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      isHydrated: false,

      setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),

      login: (user) => set({ currentUser: user, isAuthenticated: true }),

      logout: () => set({ currentUser: null, isAuthenticated: false }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "convoSpaceUser",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
