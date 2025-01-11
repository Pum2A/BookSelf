"use client";
import React, { useState, useEffect } from "react";
import NavButton from "./reusableComponents/NavButton";
import { CiMenuBurger } from "react-icons/ci";
import MobileMenu from "./MobileMenu";

function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className="flex justify-between items-center h-16 bg-white text-black relative shadow-sm"
      role="navigation"
    >
      <div className="flex items-center">
        <a
          href="/"
          className="mx-4 text-2xl font-light tracking-tighter text-black"
        >
          <span className="font-semibold">BOOK</span>
          Self
        </a>
      </div>
      <CiMenuBurger
        size={30}
        className="mx-2 lg:hidden cursor-pointer"
        onClick={toggleMenu}
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleMenu()}
      />
      <ul className="hidden lg:flex items-center gap-4">
        <NavButton href="/home">Home</NavButton>
        <NavButton href="/about">Booking</NavButton>
        <NavButton href="/rules">History</NavButton>
        <NavButton href="/support">Support</NavButton>
      </ul>
      <ul className="hidden lg:flex items-center gap-4 tracking-tighter">
        <NavButton href="/login">Login</NavButton>
        <span className="bg-gray-200 px-7 py-2 mx-5 rounded-2xl shadow-sm font-normal flex items-center cursor-pointer gap-2">
          <CiMenuBurger />
          Menu
        </span>
      </ul>
      {menuOpen && <MobileMenu toggleMenu={toggleMenu} />}
    </nav>
  );
}

export default Topbar;
