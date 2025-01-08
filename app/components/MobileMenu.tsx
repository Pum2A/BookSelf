import React from "react";
import NavButton from "./reusableComponents/NavButton";
import { IoCloseCircleSharp } from "react-icons/io5";

interface MobileMenuProps {
  toggleMenu: () => void;
}

function MobileMenu({ toggleMenu }: MobileMenuProps) {
  return (
    <div className="lg:hidden absolute top-0 flex justify-center items-center w-full h-screen bg-gray-900">
      <IoCloseCircleSharp
        onClick={toggleMenu}
        size={30}
        className="absolute top-2 right-2"
      />
      <ul className="w-full">
        <NavButton href="/home">Home</NavButton>
        <NavButton href="/about">About</NavButton>
        <NavButton href="/rules">Rules</NavButton>
        <NavButton href="/support">Support</NavButton>
        <NavButton href="/user">User Profile</NavButton>
      </ul>
    </div>
  );
}

export default MobileMenu;
