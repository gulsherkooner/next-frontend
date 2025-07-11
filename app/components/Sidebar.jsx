"use client";
import React, { useEffect, useRef } from "react";
import {
  Heart,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "../hooks/use-mobile";
import { deleteCookie } from "../lib/utils/cookie";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = ({ menu, setMenu }) => {
  const isMobile = useIsMobile();
  const sidebarRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Helper function to check if a link is active
  const isActiveLink = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    
    // For search links, check if pathname starts with search and contains the same query params
    if (link.startsWith("/search") && typeof window !== 'undefined') {
      const url = new URL(link, window.location.origin);
      const linkType = url.searchParams.get("type");
      const currentUrl = new URL(pathname + window.location.search, window.location.origin);
      const currentType = currentUrl.searchParams.get("type");
      
      return pathname === "/search" && linkType === currentType;
    }
    
    return pathname === link;
  };

  const menuItems = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.25 16.3C1.61667 15.5667 1.10833 14.75 0.725 13.85C0.341667 12.95 0.1 12 0 11H2.05C2.15 11.7334 2.33333 12.429 2.6 13.087C2.86667 13.7457 3.21667 14.35 3.65 14.9L2.25 16.3ZM0 9.00005C0.133333 8.00005 0.383333 7.05005 0.75 6.15005C1.11667 5.25005 1.61667 4.43338 2.25 3.70005L3.65 5.10005C3.21667 5.65005 2.86667 6.25405 2.6 6.91205C2.33333 7.57071 2.15 8.26672 2.05 9.00005H0ZM8.95 19.9501C7.95 19.85 7.00433 19.6084 6.113 19.225C5.221 18.8417 4.4 18.35 3.65 17.75L5.05 16.3C5.63333 16.7334 6.246 17.0917 6.888 17.375C7.52933 17.6584 8.21667 17.85 8.95 17.9501V19.9501ZM5.1 3.70005L3.65 2.25005C4.4 1.65005 5.221 1.15838 6.113 0.775049C7.00433 0.391716 7.96667 0.150049 9 0.0500488V2.05005C8.25 2.15005 7.55 2.34172 6.9 2.62505C6.25 2.90838 5.65 3.26672 5.1 3.70005ZM7.5 14.5V5.50005L14.5 10L7.5 14.5ZM11 19.9501V17.9501C13.0167 17.6667 14.6877 16.775 16.013 15.275C17.3377 13.775 18 12.0167 18 10C18 7.98338 17.3377 6.22505 16.013 4.72505C14.6877 3.22505 13.0167 2.33338 11 2.05005V0.0500488C13.5667 0.333382 15.7083 1.41672 17.425 3.30005C19.1417 5.18338 20 7.41672 20 10C20 12.5834 19.1417 14.8167 17.425 16.7001C15.7083 18.5834 13.5667 19.6667 11 19.9501Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Reels",
      link: "/reels",
      implemented: true, // Mark as implemented
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M2 4H18V6H2V4ZM4 0H16V2H4V0ZM18 8H2C0.9 8 0 8.9 0 10V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V10C20 8.9 19.1 8 18 8ZM18 18H2V10H18V18ZM8 10.73V17.26L14 14L8 10.73Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Subscriptions",
      link: "/",
      implemented: false, // Mark as not implemented
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="19"
          viewBox="0 0 16 19"
          fill="none"
        >
          <path
            d="M12 4L11.56 4.55C11.14 5.07 10.58 5.3 10.02 5.3C9 5.3 8 4.52 8 3.3V0C8 0 0 4 0 11C0 15.42 3.58 19 8 19C12.42 19 16 15.42 16 11C16 8.04 14.39 5.38 12 4ZM8 17C6.9 17 6 16.13 6 15.06C6 14.55 6.2 18.77 6.58 18.4L8 17L9.43 18.4C9.8 18.77 10 14.55 10 15.06C10 16.13 9.1 17 8 17ZM11.96 15.5C12 15.14 12.18 13.61 10.83 12.28L8 9.5L5.17 12.28C3.81 13.62 4 15.16 4.04 15.5C2.79 14.4 2 12.79 2 11C2 7.84 4.13 5.35 6.03 3.75C6.26 5.74 7.96 7.3 10.02 7.3C10.8 7.3 11.56 7.07 12.2 6.64C13.34 7.78 14 9.35 14 11C14 12.79 13.21 14.4 11.96 15.5Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Trending",
      link: "/",
      implemented: false, // Mark as not implemented
    },
  ];

  const contentItems = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M2 4H0V18C0 19.1 0.9 20 2 20H16V18H2V4ZM18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 14H6V2H18V14ZM10 3.5V12.5L16 8L10 3.5Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Videos",
      link: "/search?q=~&type=videos",
      implemented: true,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
        >
          <path
            d="M3 13H17V11H3V13ZM3 9H17V7H3V9ZM3 5H13V3H3V5ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM2 14H18V2H2V14Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Posts",
      link: "/search?q=~&type=posts",
      implemented: true,
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M6 14H18V2H16V9L13.5 7.5L11 9V2H6V14ZM6 16C5.45 16 4.97933 15.8043 4.588 15.413C4.196 15.021 4 14.55 4 14V2C4 1.45 4.196 0.979 4.588 0.587C4.97933 0.195667 5.45 0 6 0H18C18.55 0 19.021 0.195667 19.413 0.587C19.8043 0.979 20 1.45 20 2V14C20 14.55 19.8043 15.021 19.413 15.413C19.021 15.8043 18.55 16 18 16H6ZM2 20C1.45 20 0.979333 19.8043 0.588 19.413C0.196 19.021 0 18.55 0 18V4H2V18H16V20H2Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Collections",
      link: "/",
      implemented: false,
    },
    { icon: <Heart size={20} />, text: "Liked Content", link: "/",implemented: false, },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="14"
          viewBox="0 0 20 14"
          fill="none"
        >
          <path
            d="M7 8.75C4.66 8.75 0 9.92 0 12.25V14H14V12.25C14 9.92 9.34 8.75 7 8.75ZM2.34 12C3.18 11.42 5.21 10.75 7 10.75C8.79 10.75 10.82 11.42 11.66 12H2.34ZM7 7C8.93 7 10.5 5.43 10.5 3.5C10.5 1.57 8.93 0 7 0C5.07 0 3.5 1.57 3.5 3.5C3.5 5.43 5.07 7 7 7ZM7 2C7.83 2 8.5 2.67 8.5 3.5C8.5 4.33 7.83 5 7 5C6.17 5 5.5 4.33 5.5 3.5C5.5 2.67 6.17 2 7 2ZM14.04 8.81C15.2 9.65 16 10.77 16 12.25V14H20V12.25C20 10.23 16.5 9.08 14.04 8.81ZM13 7C14.93 7 16.5 5.43 16.5 3.5C16.5 1.57 14.93 0 13 0C12.46 0 11.96 0.13 11.5 0.35C12.13 1.24 12.5 2.33 12.5 3.5C12.5 4.67 12.13 5.76 11.5 6.65C11.96 6.87 12.46 7 13 7Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Community",
      link: "/",
      implemented: false,
    },
  ];

  const accountItems = [
    { icon: <Settings size={20} />, text: "Settings", link: "/settings",implemented: true, },
    { icon: <HelpCircle size={20} />, text: "Help & Support", link: "/", implemented: false, },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
        >
          <path
            d="M7.09 13.1254L8.5 14.5354L13.5 9.5354L8.5 4.5354L7.09 5.9454L9.67 8.5354H0V10.5354H9.67L7.09 13.1254ZM16 0.5354H2C0.89 0.5354 0 1.4354 0 2.5354V6.5354H2V2.5354H16V16.5354H2V12.5354H0V16.5354C0 17.6354 0.89 18.5354 2 18.5354H16C17.1 18.5354 18 17.6354 18 16.5354V2.5354C18 1.4354 17.1 0.5354 16 0.5354Z"
            fill="currentColor"
          />
        </svg>
      ),
      text: "Log Out",
      link: "/logout",
      implemented: true,
    },
  ];

  useEffect(() => {
    // Function to check if clicked outside of sidebar
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        menu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest('[data-menu-toggle="true"]')
      ) {
        setMenu(false);
      }
    };

    if (isMobile && menu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, menu, setMenu]);

  const handleLogOut = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    window.location.href = "/";
  };

  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      const isActive = item.implemented !== false ? isActiveLink(item.link) : false;
      const isImplemented = item.implemented !== false;
      
      return (
        <Link
          href={isImplemented ? item.link : "#"}
          key={index}
          onClick={
            item.text === "Log Out"
              ? (e) => {
                  e.preventDefault();
                  handleLogOut();
                }
              : !isImplemented
              ? (e) => {
                  e.preventDefault();
                  // Optionally show a toast or message
                  console.log(`${item.text} is not implemented yet`);
                }
              : undefined
          }
          className={`flex items-center px-3 py-2 text-[14px] rounded-lg transition-colors duration-200 ${
            isActive
              ? "bg-neutral-300"
              : isImplemented
              ? "hover:bg-gray-200 text-neutral-500"
              : "text-neutral-400 cursor-not-allowed opacity-50"
          }`}
        >
          <span className={`mr-4 flex-shrink-0 ${
            isActive 
              ? "text-teal-600" 
              : isImplemented 
              ? "text-neutral-700" 
              : "text-neutral-400"
          }`}>
            {item.icon}
          </span>
          <span className={`font-bold ${
            isActive 
              ? "text-teal-600" 
              : isImplemented 
              ? "text-neutral-500" 
              : "text-neutral-400"
          }`}>
            {item.text}
          </span>
        </Link>
      );
    });
  };

  const sidebarClass = isMobile
    ? `w-3/4 fixed z-30 bg-white ${
        menu ? "left-0" : "-left-full"
      } transition-all duration-300`
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
        className={`${sidebarClass} top-14 bottom-0 overflow-hidden`}
        style={{ height: "calc(100vh - 3.5rem)" }}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <div className="p-2 space-y-2 min-h-full flex flex-col">
            {/* Main menu items */}
            <div className="space-y-1">{renderMenuItems(menuItems)}</div>

            <div className="border-b w-full my-3 border-gray-300"></div>

            {/* Content section */}
            <div className="space-y-1">
              <div className="flex items-center px-3 py-2 text-md text-black font-bold">
                <span className="flex justify-center items-center gap-2">
                  Content <ChevronRight size={20} />
                </span>
              </div>
              {renderMenuItems(contentItems)}
            </div>

            <div className="border-b w-full my-3 border-gray-300"></div>

            {/* Account section */}
            <div className="space-y-1 flex-grow">
              <div className="flex items-center px-3 py-2 text-md text-black font-bold">
                <span className="flex justify-center items-center gap-2">
                  Account <ChevronRight size={20} />
                </span>
              </div>
              {renderMenuItems(accountItems)}
            </div>

            <div className="h-4"></div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
