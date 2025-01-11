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

  const mobileStyles = isActive
    ? "bg-green-400 text-white font-semibold shadow-md"
    : "bg-gray-200 text-gray-700 hover:bg-green-400 hover:text-white";

  const desktopStyles = isActive
    ? "border-b-4 border-green-400"
    : "text-black hover:border-b-4 hover:border-green-400";

  return (
    <li
      className={`relative py-3 px-4  text-center cursor-pointer tracking-tighter ${
        isMobile ? "text-xl w-full" : "text-lg lg:mx-5"
      } ${isMobile ? mobileStyles : desktopStyles} ${className}  `}
      onClick={() => router.push(href)}
    >
      {children}
    </li>
  );
}

export default NavButton;
