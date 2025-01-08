import React from "react";

type NavButtonTypes = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

function NavButton({ children, href, className }: NavButtonTypes) {
  return (
    <li
      className={`bg-gray-800 text-white mx-2 my-2 py-2 px-4 rounded-md hover:bg-gray-600 transition-all cursor-pointer ${className}`}
    >
      {children}
    </li>
  );
}

export default NavButton;
