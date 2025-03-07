// stores/userStore.ts
import { create } from "zustand";

type User = {
  id: number;
  username: string;
  email: string;
  token: string; // Added token field
  createdAt: Date;
  bio?: string;
  avatar?: string;
  role: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  updateUserRole: (role: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUserRole: (role) =>
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    })),
}));
