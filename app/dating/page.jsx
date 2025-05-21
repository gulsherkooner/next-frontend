'use client';
import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { useIsMobile } from "../hooks/use-mobile";
import CreateProfileBox from "../components/CreateDatingProfile";
import FiltersBox from "../components/FiltersBox";
import TaskCompletedBox from "../components/ProfileList";
import WalletCard from "../components/WalletCard";
import { getCookie } from '../lib/utils/cookie';

export default function DatingPage() {
  const [filters, setFilters] = useState({
    gender: "Female",
    ageRange: [18, 60],
    distance: 50,
    locations: [],
    languages: [],
    lookingFor: "Casual Dating",
    likes: []
  });

  const [fromParam, setFromParam] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Read URL param
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setFromParam(params.get('from'));
    }
  }, []);

  // Check profile status on mount
  useEffect(() => {
    const checkProfileStatus = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const accessToken = getCookie("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/check-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // 👈 pass userId in Authorization header
            // 'credentials': "include"
          }
        });

        if (!response.ok) throw new Error('Profile check failed');

        const { exists } = await response.json();
        setHasProfile(exists);
      } catch (error) {
        console.error("Profile check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkProfileStatus();
  }, []);


  const handleProfileComplete = () => {
    setHasProfile(true);
    // Optional: You might want to refetch the profile here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center py-8 text-gray-500">Loading your dating profile...</div>
      </div>
    );
  }

  // Main rendering logic
  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />

      <div className="pt-16 px-4 flex flex-col lg:flex-row justify-center gap-6">
        <main className="flex-1 max-w-full md:max-w-sm xl:max-w-2xl 2xl:max-w-2xl mx-auto p-2 sm:p-4">
          {!hasProfile ? (
            <CreateProfileBox onComplete={handleProfileComplete} />
          ) : (
            <TaskCompletedBox
              genderFilter={filters.gender}
              ageRangeFilter={filters.ageRange}
              locationFilters={filters.locations}
              languageFilters={filters.languages}
              lookingForFilters={filters.lookingFor}
              likesFilters={filters.likes}
            />
          )}
        </main>

        {/* Sidebar - only shown when profile exists and not on mobile */}
        {hasProfile && !isMobile && (
          <aside className="hidden lg:block w-56 fixed right-0 h-[calc(100vh-160px)] overflow-y-auto border-r border-gray-200 top-14">
            <WalletCard />
            <FiltersBox
              gender={filters.gender}
              setGender={(val) => setFilters({ ...filters, gender: val })}
              ageRange={filters.ageRange}
              setAgeRange={(val) => setFilters({ ...filters, ageRange: val })}
              distance={filters.distance}
              setDistance={(val) => setFilters({ ...filters, distance: val })}
              selectedLocations={filters.locations}
              setSelectedLocations={(val) => setFilters({ ...filters, locations: val })}
              selectedLanguages={filters.languages}
              setSelectedLanguages={(val) => setFilters({ ...filters, languages: val })}
              lookingFor={filters.lookingFor}
              setLookingFor={(val) => setFilters({ ...filters, lookingFor: val })}
              likes={filters.likes}
              setLikes={(val) => setFilters({ ...filters, likes: val })}
            />
          </aside>
        )}
      </div>

      <MobileNav />
    </div>
  );
}