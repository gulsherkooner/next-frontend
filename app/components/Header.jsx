// components/Header.jsx
"use client"
import React from "react";
import { Search, Home, Bell, Mail, User, Wallet, Menu, Heart } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';

const Header = ({ setMenu, menu }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const handleMenu = () => {
    setMenu(!menu);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-[#b4b4b4] z-30 flex items-center justify-between px-2 md:px-4 xl:px-4 2xl:px-4">
      <div className="flex items-center gap-4 w-full max-w-screen mx-auto">
        {/* Left section - Search bar */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <User size={20} className="text-gray-900" />
          </button>

          {isMobile && (
            <h2 className="text-lg font-semibold text-gray-800">App name</h2>
          )}

          {!isMobile && (
            <div className="relative">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="bg-white pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>
          )}
        </div>

        {/* Center icon (Home) */}
        {!isMobile && (
          <div className="flex absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className={`w-14 h-14 flex items-center justify-center text-gray-900 hover:text-gray-800 ${pathname === '/' ? 'border-b-2 border-black' : ''
                }`}
            >
              <Home size={24} />
            </Link>
            <Link
              href="/dating"
              className={`w-14 h-14 flex items-center justify-center text-gray-900 hover:text-gray-800 ml-4 ${pathname === '/dating' ? 'border-b-2 border-black' : ''
                }`}
            >
              <Heart size={24} />
            </Link>
          </div>
        )}
        {/* Right section - Icons */}
        <div className={`flex items-center ${isMobile ? "gap-0" : "gap-4"} ml-auto`}>
          {!isMobile && (
            <button className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${pathname === '/Wallet' ? 'border-2 border-black' : ''}`}
              onClick={() => router.push('/Wallet')}>
              <Wallet size={20} className="text-gray-900" />
            </button>
          )}

          {isMobile && (
            <button className={`w-10 h-10 rounded-full flex items-center justify-center`}>
              <Search size={20} className="text-gray-900" />
            </button>
          )}

          <button className={`w-10 h-10 rounded-full ${!isMobile && "bg-white"} flex items-center justify-center`}
          onClick={() => router.push('/dating/messages')}>
            <Mail size={20} className="text-gray-900" />
          </button>

          <button className={`w-10 h-10 rounded-full ${!isMobile && "bg-white"} flex items-center justify-center`}>
            <Bell size={20} className="text-gray-900" />
          </button>

          {isMobile && (
            <button
              onClick={handleMenu}
              data-menu-toggle="true"
              className={`w-10 h-10 rounded-full flex items-center justify-center`}
            >
              <Menu size={20} className="text-gray-900" />
            </button>
          )}

          {!isMobile && (
            <button className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${pathname === '/profile' ? 'border-2 border-black' : ''}`} onClick={() =>router.push("/profile")}>
              <User size={20} className="text-gray-900" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;