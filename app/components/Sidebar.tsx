"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

const navItemVariants = {
  hover: { scale: 1.05 },
};

const NavItemComponent: React.FC<NavItemProps> = ({
  href,
  icon: Icon,
  label,
  active = false,
  onClick,
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`group relative w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors duration-300
      ${
        active
          ? "bg-accents/10 text-accents before:absolute before:left-0 before:h-6 before:w-1 before:bg-accents before:rounded-full"
          : "text-secondText hover:bg-sections hover:text-text"
      }`}
  >
    <motion.div
      variants={navItemVariants}
      whileHover="hover"
      className="p-2 rounded-lg bg-sections/50 backdrop-blur-sm"
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
      className={`ml-auto transform transition-opacity ${
        active
          ? "text-accents"
          : "text-secondText opacity-0 group-hover:opacity-100"
      }`}
    />
  </Link>
);

const NavItem = React.memo(NavItemComponent);

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

  const handleBecomeOWNER = useCallback(async () => {
    try {
      const response = await fetch("/api/users/become-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      if (response.ok) {
        toast.success("Jesteś OWNEREM!");
        useUserStore.getState().updateUserRole("OWNER");
        router.refresh();
      } else {
        toast.error("Nie udało się zupgradować konta!");
      }
    } catch (error) {
      console.error("Become OWNER error:", error);
      toast.error("Nie udało się zupgradować konta!");
    }
  }, [router, user]);

  const handleSwitchToCustomer = useCallback(async () => {
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
  }, [router, user]);

  const handleSignOut = useCallback(async () => {
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
  }, [router]);

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className="fixed top-4 right-4 p-2 rounded-xl bg-background/80 backdrop-blur-md text-text z-50 lg:hidden shadow-lg hover:bg-sections transition-colors"
      >
        <MenuIcon size={24} />
      </motion.button>

      <motion.div
        className="fixed top-0 left-0 h-screen w-72 bg-background/95 backdrop-blur-lg border-r border-border z-50 flex flex-col shadow-2xl"
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
              className="p-4 mb-4 rounded-xl bg-sections shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-accents/10 blur-md rounded-full" />
                  <Image
                    src={userData.avatar || "/default-icon.jpg"}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-border relative z-10"
                  />
                  {userData.role === "OWNER" && (
                    <div className="absolute -top-1 -right-1 bg-accents rounded-full p-1 shadow-md">
                      <ShieldIcon size={12} className="text-background" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text font-medium truncate">
                    {userData.username}
                  </p>
                  <Link
                    href="/profile"
                    className="text-xs text-secondText hover:text-accents transition-colors flex items-center gap-1 truncate"
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
              <h3 className="px-4 text-xs font-medium text-secondText uppercase tracking-wider mb-1">
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
              <h3 className="px-4 text-xs font-medium text-secondText uppercase tracking-wider mb-1">
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
          <div className="mt-auto space-y-4 pt-4 border-t border-border">
            {isLoggedIn && user?.role !== "OWNER" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4"
              >
                <Button
                  onClick={handleBecomeOWNER}
                  className="w-full bg-gradient-to-br from-accents to-accents-dark text-text rounded-lg transition-colors shadow-xl hover:shadow-2xl"
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
                  className="w-full bg-gradient-to-br from-accents to-accents-dark text-text rounded-lg transition-colors shadow-xl hover:shadow-2xl"
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
                className="border-t border-border pt-4"
              >
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-gradient-to-br from-red-600 to-red-500 text-text rounded-lg transition-colors shadow-xl hover:shadow-2xl"
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
