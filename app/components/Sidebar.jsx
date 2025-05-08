import React, { useEffect, useRef } from "react";
import { Home, Play, Users, TrendingUp, Video, FileText, Bookmark, Heart, Star, Settings, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/use-mobile";

const Sidebar = ({ menu, setMenu }) => {
  const isMobile = useIsMobile();
  const sidebarRef = useRef(null);
  
  const menuItems = [
    { icon: <Play size={20} />, text: "Reels", link: "/" },
    { icon: <Users size={20} />, text: "Subscriptions", link: "/" },
    { icon: <TrendingUp size={20} />, text: "Trending", link: "/" },
  ];

  const contentItems = [
    { icon: <Video size={20} />, text: "Videos", link: "/" },
    { icon: <FileText size={20} />, text: "Posts", link: "/" },
    { icon: <Bookmark size={20} />, text: "Collections", link: "/" },
    { icon: <Heart size={20} />, text: "Liked Content", link: "/" },
    { icon: <Star size={20} />, text: "Premium", link: "/" },
    { icon: <Users size={20} />, text: "Followers", link: "/" },
  ];

  const accountItems = [
    { icon: <Settings size={20} />, text: "Settings", link: "/" },
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

  const renderMenuItems = (items) => {
    return items.map((item, index) => (
      <Link href={item.link} key={index} className="flex items-center p-3 hover:bg-gray-100 rounded-lg">
        <div className="mr-4 text-gray-500">{item.icon}</div>
        <span className="text-gray-700">{item.text}</span>
      </Link>
    ));
  };

  // For desktop/tablet view, always show the sidebar
  // For mobile, show based on menu state
  const sidebarClass = isMobile 
    ? `w-3/4 fixed z-10 bg-white ${menu ? "left-0" : "-left-full"} transition-all duration-300`
    : "hidden md:block w-56 fixed left-0";

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      {isMobile && menu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[5]" 
          onClick={() => setMenu(false)}
        />
      )}
      
      <aside 
        ref={sidebarRef}
        className={`${sidebarClass} h-screen overflow-y-auto border-r border-gray-200 top-14`}
      >
        <div className="p-2">
          {renderMenuItems(menuItems)}

          <div className="mt-4">
            <div className="flex items-center px-3 py-2 text-sm text-gray-500 font-medium">
              <span>Content</span>
            </div>
            {renderMenuItems(contentItems)}
          </div>

          <div className="mt-4">
            <div className="flex items-center px-3 py-2 text-sm text-gray-500 font-medium">
              <span>Account</span>
            </div>
            {renderMenuItems(accountItems)}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;