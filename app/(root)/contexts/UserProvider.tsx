"use client"; // Musi być Client Component

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export default function UserProvider({ user }: { user: any }) {
  const { setUser } = useUserStore();

  useEffect(() => {
    if (user) {
      setUser(user);
      console.log("🔑 Użytkownik ustawiony w Zustand:", user);
    }
  }, [user, setUser]);

  return null; // Nie renderuje nic, tylko aktualizuje store
}
