import React from "react";
import { Search, Home, Bell, Mail, User, Wallet, Menu } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/use-mobile";
import { useRouter } from "next/navigation";

const Header = ({ setMenu, menu, home, setHome }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  
  const handleMenu = () => {
    setMenu(!menu);
  };
  
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-gray-200 z-10 flex items-center justify-between px-2 md:px-4 xl:px-4 2xl:px-4">
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
          <div className="flex absolute left-1/2 transform -translate-x-1/2" onClick={()=>setHome(true)}>
            <Link 
              href="/" 
              className={`w-14 h-14 flex items-center justify-center text-gray-900 hover:text-gray-800 ${home ? "border-b-2 border-gray-900" : "border-transparent"}`}
            >
              <Home size={24} />
            </Link>
          </div>
        )}

        {/* Right section - Icons */}
        <div className={`flex items-center ${isMobile ? "gap-0" : "gap-4"} ml-auto`}>
          {!isMobile && (
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Wallet size={20} className="text-gray-900" />
            </button>
          )}

          {isMobile && (
            <button className={`w-10 h-10 rounded-full flex items-center justify-center`}>
              <Search size={20} className="text-gray-900" />
            </button>
          )}
          
          <button className={`w-10 h-10 rounded-full ${!isMobile && "bg-white"} flex items-center justify-center`}>
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
          {/* router.push('/login') */}
          {!isMobile && (
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center" onClick={()=>setHome(false)}>
              <User size={20} className="text-gray-900" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;