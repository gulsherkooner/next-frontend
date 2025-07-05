"use client"
import React, { useEffect, useRef } from "react";
import { Home, Play, Users, TrendingUp, Video, FileText, Bookmark, Heart, Star, Settings, HelpCircle, LogOut, ArrowRight, UserRoundCheck, Flame, Youtube, Images, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/use-mobile";
import { deleteCookie } from "../lib/utils/cookie";
import { useRouter } from "next/navigation";

const Sidebar = ({ menu, setMenu }) => {
  const isMobile = useIsMobile();
  const sidebarRef = useRef(null);
  
  const menuItems = [
    { icon: <Play size={20} />, text: "Reels", link: "/reels" },
    { icon: <UserRoundCheck size={20} />, text: "Subscriptions", link: "/" },
    { icon: <Flame size={20} />, text: "Trending", link: "/" },
  ];

  const contentItems = [
    { icon: <Youtube size={20} />, text: "Videos", link: "/search?q=~&type=videos" },
    { icon: <Images size={20} />, text: "Posts", link: "/search?q=~&type=posts" },
    { icon: <Bookmark size={20} />, text: "Collections", link: "/" },
    { icon: <Heart size={20} />, text: "Liked Content", link: "/" },
    { icon: <BadgeCheck size={20} />, text: "Content creators", link: "/" },
    { icon: <Users size={20} />, text: "Followers", link: "/" },
  ];

  const accountItems = [
    { icon: <Settings size={20} />, text: "Settings", link: "/settings" },
    { icon: <HelpCircle size={20} />, text: "Help & Support", link: "/" },
    { icon: <LogOut size={20} />, text: "Log Out", link: "/" },
  ];

  useEffect(() => {
    // Function to check if clicked outside of sidebar
    const handleClickOutside = (event) => {
      // Only close if:
      // 1. We're on mobile 
      // 2. The sidebar is open
      // 3. The click is outside the sidebar
      // 4. The click is not on the menu toggle button
      if (
        isMobile && 
        menu && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target) &&
        !(event.target).closest('[data-menu-toggle="true"]')
      ) {
        setMenu(false);
      }
    };

    // Add event listener when sidebar is open on mobile
    if (isMobile && menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, menu, setMenu]);

  // Dummy handleLogOut function (replace with your actual logic)
  const router = useRouter();
  const handleLogOut = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    router.push("/")
  };

  const renderMenuItems = (items) => {
    return items.map((item, index) => (
      <Link
        href={item.link}
        key={index}
        onClick={item.text === "Log Out" ? (e) => { e.preventDefault(); handleLogOut(); } : undefined}
        className="flex items-center px-3 py-2 hover:bg-gray-200 rounded-lg"
      >
        <div className="mr-4 text-gray-500">{item.icon}</div>
        <span className="text-gray-700">{item.text}</span>
      </Link>
    ));
  };

  // For desktop/tablet view, always show the sidebar
  // For mobile, show based on menu state
  const sidebarClass = isMobile 
    ? `w-3/4 fixed z-20 bg-white ${menu ? "left-0" : "-left-full"} transition-all duration-300`
    : "hidden md:block w-56 fixed left-0";

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      {isMobile && menu && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-20"
          onClick={() => setMenu(false)}
        />
      )}
      
      <aside 
        ref={sidebarRef}
        className={`${sidebarClass} h-screen overflow-y-aut0 top-14`}
      >
        <div className="p-2">
          {renderMenuItems(menuItems)}

          <div className="border-b w-full mt-3 border-gray-300"></div>

          <div className="mt-4">
            <div className="flex items-center px-3 py-2 text-sm text-gray-500 font-medium">
              <span className="flex justify-center items-center gap-2">Content <ArrowRight size={16} /></span>
            </div>
            {renderMenuItems(contentItems)}
          </div>

          <div className="border-b w-full mt-3 border-gray-300"></div>

          <div className="mt-4">
            <div className="flex items-center px-3 py-2 text-sm text-gray-500 font-medium">
              <span className="flex justify-center items-center gap-2">Account <ArrowRight size={16} /></span>
            </div>
            {renderMenuItems(accountItems)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;