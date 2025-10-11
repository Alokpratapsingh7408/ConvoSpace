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
  updateUserStatus: (userId: number, status: 'online' | 'offline', lastSeenAt?: string) => void;
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

      updateUserStatus: (userId, status, lastSeenAt) => set((state) => {
        // Update current user status if it's them
        if (state.currentUser && state.currentUser.id === userId) {
          return {
            currentUser: {
              ...state.currentUser,
              status,
              lastSeen: lastSeenAt ? new Date(lastSeenAt) : undefined,
            },
          };
        }
        return state;
      }),
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
