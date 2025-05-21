'use client';
import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { useIsMobile } from "../hooks/use-mobile";
import ProfileSuggestion from "../components/ProfileSuggestion";

import WalletBox from "../components/walletComponents/Walletbox";

export default function WalletPage() {
  const isMobile = useIsMobile();
  
  const trendingProfiles = [
    { username: "Username 1", followers: "21k" },
    { username: "Username 2", followers: "153k" },
    { username: "Username 3", followers: "19k" },
    { username: "Username 4", followers: "64k" },
  ];

  // Sample data for suggested profiles
  const suggestedProfiles = [
    { username: "Username 1", followers: "23k" },
    { username: "Username 2", followers: "16k" },
    { username: "Username 3", followers: "53k" },
    { username: "Username 4", followers: "237k" },
    { username: "Username 5", followers: "432k" },
    { username: "Username 6", followers: "121k" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />

      <div className="pt-16 px-4 flex flex-col lg:flex-row justify-center gap-6 md:pl-56">
        <main className="flex-1 max-w-full md:max-w-sm xl:max-w-2xl 2xl:max-w-2xl mx-auto p-2 sm:p-4">
          <WalletBox />
        </main>
      </div>
      {!isMobile && (
        <aside className="hidden lg:block w-56 fixed right-0 h-[calc(100vh-160px)] overflow-y-auto border-r border-gray-200 top-14">
          <ProfileSuggestion
                title="Trending Profiles"
                profiles={trendingProfiles}
              />

              <ProfileSuggestion
                title="Suggested for you"
                profiles={suggestedProfiles}
              />
        </aside>
      )}
      <MobileNav />
    </div>
  );
}
