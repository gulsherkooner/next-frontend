'use client';

import React from "react";
import {
  Home,
  Play,
  Heart,
  User,
  Wallet,
} from "lucide-react";
import { Heart as HeartFilled } from "lucide-react"; // Reuse or customize
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-14 md:hidden z-10">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-1/5 ${isActive('/') ? 'text-teal-500' : 'text-neutral-700'}`}
      >
        <Home size={27} />
      </Link>

      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-1/5 ${isActive('/play') ? 'text-teal-500' : 'text-neutral-700'}`}
      >
        <Play size={27} />
      </Link>

      <Link
        href="/dating"
        className={`flex flex-col items-center justify-center w-1/5 ${isActive('/dating') ? 'text-teal-500' : 'text-neutral-700'}`}
      >
        {isActive('/dating') ? <HeartFilled fill="currentColor" size={27} /> : <Heart size={27} />}
      </Link>

      <Link
        href="/Wallet"
        className={`flex flex-col items-center justify-center w-1/5 ${isActive('/Wallet') ? 'text-teal-500' : 'text-neutral-700'}`}
      >
        <Wallet size={27} />
      </Link>

      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center w-1/5 ${isActive('/profile') ? 'text-teal-500' : 'text-neutral-700'}`}
      >
        <User size={27} />
      </Link>
    </div>
  );
};

export default MobileNav;
