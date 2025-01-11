"use client"; // Pamiętaj, że to jest klientowy komponent

import React, { createContext, useState, useContext, ReactNode } from "react";

// Typy stanu menu
interface MenuContextType {
  menuOpen: boolean;
  toggleMenu: () => void;
}

// Tworzymy domyślną wartość kontekstu
const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Provider kontekstu
export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <MenuContext.Provider value={{ menuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook do używania MenuContext
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
