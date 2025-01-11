import React from "react";
import { usePathname, useRouter } from "next/navigation";

type NavButtonTypes = {
  children: React.ReactNode;
  href: string;
  className?: string;
  isMobile?: boolean;
};

function NavButton({
  children,
  href,
  className,
  isMobile = false,
}: NavButtonTypes) {
  const router = useRouter();
  const isActive = usePathname() === href;

  // Style na urządzenia mobilne
  const mobileStyles = isActive
    ? "bg-green-600 text-white font-medium shadow-lg transform scale-105"
    : "bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white transition-all transform hover:scale-105";

  // Style na desktop
  const desktopStyles = isActive
    ? "border-l-4 border-green-600 text-green-600 pl-4"
    : "text-gray-600 hover:border-l-4 hover:border-green-600 hover:text-green-600 transition-all";

  return (
    <li
      className={`relative py-2 px-6 text-center cursor-pointer -tracking-tight rounded-md transition-all flex ${
        isMobile ? mobileStyles : desktopStyles
      } ${className}`}
      onClick={() => router.push(href)}
    >
      {children}
    </li>
  );
}

export default NavButton;
