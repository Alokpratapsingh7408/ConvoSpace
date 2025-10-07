import { create } from "zustand";
import { User } from "@/types/chat";

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),

  login: (user) => set({ currentUser: user, isAuthenticated: true }),

  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
