import { create } from 'zustand';

interface UserStore {
  user: { id: number; username: string; email: string; password: string; createdAt: Date } | null;
  setUser: (user: { id: number; username: string; email: string; password: string; createdAt: Date }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
