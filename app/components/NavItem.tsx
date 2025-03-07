"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const isActive = pathname === href;

  const handleClick = () => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${
        isActive
          ? "bg-red-500 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-lg">
        <Icon size={20} className="group-hover:text-white" />
      </motion.div>
      <span className="font-medium text-sm">{label}</span>
      {/* Wyświetlamy spinner tylko dla aktywnego elementu, gdy nawigacja trwa */}
      {isActive && isPending && (
        <Loader2 size={16} className="ml-auto animate-spin" />
      )}
    </button>
  );
};

export default NavItem;
