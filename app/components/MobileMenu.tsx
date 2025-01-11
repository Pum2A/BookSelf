import React from "react";
import NavButton from "./reusableComponents/NavButton";
import { IoCloseCircleSharp } from "react-icons/io5";
import {
  AiFillHome,
  AiOutlineInfoCircle,
  AiOutlineBook,
  AiOutlineUser,
} from "react-icons/ai";
import { MdSupportAgent } from "react-icons/md";

interface MobileMenuProps {
  toggleMenu: () => void;
}

function MobileMenu({ toggleMenu }: MobileMenuProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-gray-100 flex flex-col items-center p-6 shadow-lg z-50">
      {/* Close Button */}
      <IoCloseCircleSharp
        onClick={toggleMenu}
        size={35}
        className="absolute top-4 right-4 cursor-pointer text-gray-700 hover:text-red-500 transition-colors"
      />

      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-6 mt-10">Menu</h2>

      {/* Navigation Items */}
      <ul className="flex flex-col gap-4 w-full">
        <NavButton href="/home" isMobile>
          <div className="flex items-center gap-3">
            <AiFillHome size={20} className="text-gray-600" />
            Home
          </div>
        </NavButton>
        <NavButton href="/about" isMobile>
          <div className="flex items-center gap-3">
            <AiOutlineInfoCircle size={20} className="text-gray-600" />
            About
          </div>
        </NavButton>
        <NavButton href="/rules" isMobile>
          <div className="flex items-center gap-3">
            <AiOutlineBook size={20} className="text-gray-600" />
            Rules
          </div>
        </NavButton>
        <NavButton href="/support" isMobile>
          <div className="flex items-center gap-3">
            <MdSupportAgent size={20} className="text-gray-600" />
            Support
          </div>
        </NavButton>
        <NavButton href="/user" isMobile>
          <div className="flex items-center gap-3">
            <AiOutlineUser size={20} className="text-gray-600" />
            User Profile
          </div>
        </NavButton>
      </ul>
    </div>
  );
}

export default MobileMenu;
