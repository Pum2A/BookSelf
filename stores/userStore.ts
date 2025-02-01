import { create } from 'zustand';

type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    bio?: string;  // Dodanie bio jako opcjonalne pole
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
      user: state.user ? { ...state.user, role } : null
    })),
}));