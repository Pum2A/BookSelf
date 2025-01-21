"use client";

import React from "react";
import NavButton from "./reusableComponents/NavButton";
import { CiMenuBurger } from "react-icons/ci";
import { AiFillHome, AiOutlineInfoCircle, AiOutlineUser } from "react-icons/ai";
import { MdSupportAgent } from "react-icons/md";
import { AiOutlineCalendar, AiOutlineHeart } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { useMenu } from "../contexts/MenuContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUserStore } from "@/stores/userStore";

function Sidebar({
  isLoggedIn,
  user,
}: {
  isLoggedIn: boolean;
  user: {
    avatar: string;
    username: string;
  } | null;
}) {
  const { menuOpen, toggleMenu } = useMenu();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

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
    <div className="relative flex min-h-screen border-r-2 border-gray-700">
      {/* Sidebar */}
      <div
        className={`top-0 left-0 z-50 h-screen w-screen lg:w-64 bg-gray-800 p-6 transform transition-all duration-300 ease-in-out 
        ${menuOpen ? "fixed" : "lg:block hidden"}`} // Sidebar wyświetlany dynamicznie
      >
        {/* Logo */}
        <a href="/" className="text-2xl text-white font-semibold mb-8 block">
          <span className="text-green-400">BOOK</span>SELF
        </a>

        {/* User Profile or Authentication */}
        {isLoggedIn && user && (
          <div className="flex items-center gap-4 mb-8">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="User Profile"
              className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover"
            />

            <div>
              <p className="text-lg text-white">{user.username}</p>
              <a
                href="/profile"
                className="text-sm text-gray-400 hover:text-white"
              >
                View Profile
              </a>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <ul className="flex flex-col gap-5 w-full">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </h3>
          <NavButton href="/home" isMobile>
            <div className="flex items-center gap-4">
              <AiFillHome size={22} className="text-gray-700" />
              Home
            </div>
          </NavButton>
          <NavButton href="/about" isMobile>
            <div className="flex items-center gap-4">
              <AiOutlineInfoCircle size={22} className="text-gray-700" />
              About
            </div>
          </NavButton>
        </ul>

        {/* Books Section */}
        <ul className="flex flex-col gap-5 w-full mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Books
          </h3>
          <NavButton href="/booking" isMobile>
            <div className="flex items-center gap-4">
              <AiOutlineCalendar size={22} className="text-gray-700" />
              Booking
            </div>
          </NavButton>
          <NavButton href="/history" isMobile>
            <div className="flex items-center gap-4">
              <FaHistory size={22} className="text-gray-700" />
              History
            </div>
          </NavButton>
          <NavButton href="/favorites" isMobile>
            <div className="flex items-center gap-4">
              <AiOutlineHeart size={22} className="text-gray-700" />
              Favorites
            </div>
          </NavButton>
        </ul>

        {/* Support Section */}
        <ul className="flex flex-col gap-5 w-full mt-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Support
          </h3>
          <NavButton href="/support" isMobile>
            <div className="flex items-center gap-4">
              <MdSupportAgent size={22} className="text-gray-700" />
              Support
            </div>
          </NavButton>

          {/* Logout Button */}
          {isLoggedIn && (
            <Button
              onClick={handleSignOut}
              className="w-full mt-4 bg-red-500 text-white hover:bg-red-600 transition duration-200"
            >
              Logout
            </Button>
          )}
        </ul>
      </div>

      {/* Menu Toggle Icon */}
      <CiMenuBurger
        size={30}
        className="text-white cursor-pointer lg:hidden fixed top-6 right-6 z-50"
        onClick={toggleMenu}
      />
    </div>
  );
}

export default Sidebar;
