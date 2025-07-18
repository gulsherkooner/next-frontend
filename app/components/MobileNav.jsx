import React from "react";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  PlayCircle,
  Play,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { Heart as HeartFilled } from "lucide-react"; // Reuse or customize
import { usePathname } from "next/navigation";



const MobileNav = () => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-14 md:hidden z-10">
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-neutral-700 w-1/5"
      >
        <Home size={27} />
        {/* <span className="text-xs mt-0.5">Home</span> */}
      </Link>
      <Link
        href="/"
        className="flex flex-col items-center justify-center text-neutral-700 w-1/5"
      >
        <Play size={27} />
        {/* <span className="text-xs mt-0.5">Search</span> */}
      </Link>
      <Link
        href="/dating"
        className={`flex flex-col items-center justify-center w-1/5 ${isActive('/dating') ? 'text-teal-500' : 'text-neutral-700'}`}
      >
        {isActive('/dating') ? <HeartFilled fill="currentColor" size={27} /> : <Heart size={27} />}
      </Link>
      <Link
        href="/Wallet"
        className="flex flex-col items-center justify-center text-neutral-700 w-1/5"
      >
        <Wallet size={27} />
        {/* <span className="text-xs mt-0.5">Activity</span> */}
      </Link>
      <Link
        href="/profile"
        className="flex flex-col items-center justify-center text-neutral-700 w-1/5"
      >
        <User size={27} />
        {/* <span className="text-xs mt-0.5">Profile</span> */}
      </Link>
    </div>
  );
};

export default MobileNav;
