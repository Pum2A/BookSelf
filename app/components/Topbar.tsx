"use client";
import React, { useState } from "react";
import NavButton from "./reusableComponents/NavButton";
import { TiThMenu } from "react-icons/ti";
import MobileMenu from "./MobileMenu";

function Topbar() {
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className="flex justify-between items-center h-16 bg-gray-900 text-white relative shadow-sm"
      role="navigation"
    >
      <div className=" flex justify-center items-center">
        <span className="px-2 font-medium text-xl text-white">BOOKERS</span>
      </div>
      <TiThMenu size={30} className="mx-2 lg:hidden" onClick={toggleMenu} />

      <ul className="hidden lg:flex items-center gap-2">
        <NavButton href="/home">Home</NavButton>
        <NavButton href="/about">About</NavButton>
        <NavButton href="/rules">Rules</NavButton>
        <NavButton href="/support">Support</NavButton>
        <NavButton href="/user">User Profile</NavButton>
      </ul>
      {menuOpen && <MobileMenu toggleMenu={toggleMenu} />}
    </nav>
  );
}

export default Topbar;
