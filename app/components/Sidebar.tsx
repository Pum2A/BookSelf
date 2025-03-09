"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useMenu } from "../(root)/contexts/MenuContext";
import {
  HomeIcon,
  InfoIcon,
  UserIcon,
  BookmarkIcon,
  HeartIcon,
  HistoryIcon,
  HelpCircleIcon,
  ShieldIcon,
  LogOutIcon,
  MenuIcon,
  ChevronRightIcon,
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
  avatar: string;
  username: string;
  role?: string;
}

interface SidebarProps {
  isLoggedIn: boolean;
  userData: UserData | null;
}

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  label,
  active = false,
  onClick,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300
        ${
          active
            ? "bg-accents/10 text-accents before:absolute before:left-0 before:h-6 before:w-1 before:bg-accents before:rounded-full"
            : "text-secondText hover:bg-background/50 hover:text-text"
        }`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="p-2 rounded-lg bg-background/20 backdrop-blur-sm"
      >
        <Icon
          size={20}
          className={`${
            active ? "text-accents" : "text-secondText group-hover:text-accents"
          }`}
        />
      </motion.div>
      <span className="font-medium text-sm">{label}</span>
      <ChevronRightIcon
        size={16}
        className={`ml-auto transform transition-transform ${
          active
            ? "text-accents"
            : "text-secondText opacity-0 group-hover:opacity-100"
        }`}
      />
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isLoggedIn, userData }) => {
  const { menuOpen, toggleMenu } = useMenu();
  const router = useRouter();
  const { user } = useUserStore();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBecomeOWNER = async () => {
    try {
      const response = await fetch("/api/users/become-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (response.ok) {
        toast.success("Jesteś OWNEREM!");
        const update = useUserStore.getState().updateUserRole;
        update("OWNER");
        router.refresh();
      } else {
        toast.error("Nie udało sie zupgradować konta!");
      }
    } catch (error) {
      console.error("Become OWNER error:", error);
      toast.error("Nie udało sie zupgradować konta!");
    }
  };

  // Nowa funkcja przełączająca rolę z OWNER na customer
  const handleSwitchToCustomer = async () => {
    try {
      const response = await fetch("/api/users/become-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (response.ok) {
        toast.success("Switched to customer role successfully!");
        useUserStore.getState().updateUserRole("customer");
        router.refresh();
      } else {
        toast.error("Failed to switch to customer role");
      }
    } catch (error) {
      console.error("Switch to customer error:", error);
      toast.error("Error switching role");
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        toast.success("Successfully signed out.");
        router.push("/signin");
        router.refresh();
      } else {
        toast.error("Failed to sign out. Please try again.");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An error occurred while signing out.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="fixed top-4 right-4 p-2 rounded-xl bg-background/80 backdrop-blur-lg text-text z-50 lg:hidden shadow-xl hover:bg-sections/50 transition-all"
      >
        <MenuIcon size={24} />
      </motion.button>

      <motion.div
        className="fixed top-0 left-0 h-screen w-72 bg-background/95 backdrop-blur-lg border-r border-border/20 z-50 flex flex-col shadow-2xl"
        initial={false}
        animate={menuOpen || isDesktop ? "open" : "closed"}
        variants={{
          open: { x: 0 },
          closed: { x: "-100%" },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-4 mb-4"
          >
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-accents to-accents-dark bg-clip-text text-transparent">
                BOOKSELF
              </span>
            </Link>
          </motion.div>

          {/* User Profile */}
          {userData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 mb-4 rounded-xl bg-background/50 border border-border/20"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-accents/10 blur-lg rounded-full" />
                  <img
                    src={userData.avatar || "/default-avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-accents/20 relative z-10"
                  />
                  {userData.role === "OWNER" && (
                    <div className="absolute -top-1 -right-1 bg-accents rounded-full p-1.5 shadow-sm">
                      <ShieldIcon size={12} className="text-text" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text font-medium truncate">
                    {userData.username}
                  </p>
                  <Link
                    href="/profile"
                    className="text-xs text-secondText/80 hover:text-accents truncate flex items-center gap-1 transition-colors"
                  >
                    View Profile <ChevronRightIcon size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <h3 className="px-4 text-xs font-medium text-secondText/60 uppercase tracking-wider mb-1">
                Navigation
              </h3>
              <nav className="space-y-1">
                <NavItem href="/home" icon={HomeIcon} label="Home" />
                <NavItem href="/about" icon={InfoIcon} label="About" />
                {user?.role !== "OWNER" && (
                  <NavItem
                    href="/reservations"
                    icon={HistoryIcon}
                    label="Reservations"
                  />
                )}
                {user?.role === "OWNER" ? (
                  <NavItem href="/firms" icon={BookmarkIcon} label="My Firms" />
                ) : (
                  <NavItem
                    href="/bookings"
                    icon={HeartIcon}
                    label="My Bookings"
                  />
                )}
              </nav>
            </div>

            <div className="space-y-2">
              <h3 className="px-4 text-xs font-medium text-secondText/60 uppercase tracking-wider mb-1">
                Management
              </h3>
              <nav className="space-y-1">
                <NavItem
                  href="/support"
                  icon={HelpCircleIcon}
                  label="Support"
                />
              </nav>
            </div>
          </div>

          {/* Account Section */}
          <div className="mt-auto space-y-4 pt-4 border-t border-border/10">
            {isLoggedIn && user?.role !== "OWNER" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4"
              >
                <Button
                  onClick={handleBecomeOWNER}
                  className="w-full bg-accents/5 hover:bg-accents/10 text-accents rounded-lg transition-all"
                  size="sm"
                >
                  <ShieldIcon size={16} className="mr-2" />
                  Upgrade to OWNER
                </Button>
              </motion.div>
            )}

            {isLoggedIn && user?.role === "OWNER" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4"
              >
                <Button
                  onClick={handleSwitchToCustomer}
                  className="w-full bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-all"
                  size="sm"
                >
                  <UserIcon size={16} className="mr-2" />
                  Switch to Customer
                </Button>
              </motion.div>
            )}

            {isLoggedIn && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-t border-border/10 pt-4"
              >
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-lg transition-all"
                  size="default"
                >
                  <LogOutIcon size={16} className="mr-2" />
                  Sign Out
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
