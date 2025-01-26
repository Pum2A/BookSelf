import { create } from 'zustand';

interface UserStore {
  user: {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    bio?: string;  // Dodanie bio jako opcjonalne pole
    avatar?: string;
  } | null;
  setUser: (user: { id: number; username: string; email: string; password: string; createdAt: Date; bio?: string; avatar?: string; }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
