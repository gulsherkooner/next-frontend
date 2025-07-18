'use client';
import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { useIsMobile } from "../hooks/use-mobile";
import CreateProfileBox from "../components/datingComponents/CreateDatingProfile";
import FiltersBox from "../components/datingComponents/FiltersBox";
import TaskCompletedBox from "../components/datingComponents/ProfileList";
import WalletCard from "../components/walletComponents/WalletCard";
import { getCookie } from '../lib/utils/cookie';
import { CircleUserRound } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false); // controls modal
  const [forceShowCreateForm, setForceShowCreateForm] = useState(false); // shows form in main content

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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/check-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // 👈 pass userId in Authorization header
            // 'credentials': "include"
          }
        });

        if (!response.ok) throw new Error('Profile check failed');

        const { exists } = await response.json();
        setHasProfile(null);
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



  // Main rendering logic
  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />

      <Sidebar />

      <div className="pt-16 px-4 flex flex-col lg:flex-row justify-center gap-6 md:pl-56">
        <main className="flex-1 max-w-full md:max-w-2xl xl:max-w-2xl 2xl:max-w-2xl mx-auto p-2 sm:p-4">
          {!forceShowCreateForm && <>
            {/* Filters Button - Top Left under Header */}
            <div className="pt-2 md:-mx-21 lg:hidden">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium 
               bg-teal-500 text-white rounded-full shadow 
               hover:bg-teal-600 active:scale-95 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 4a1 1 0 012 0h14a1 1 0 110 2H5a1 1 0 01-2 0zM3 12a1 1 0 012 0h10a1 1 0 110 2H5a1 1 0 01-2 0zM3 20a1 1 0 012 0h6a1 1 0 110 2H5a1 1 0 01-2 0z" />
                </svg>
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Sidebar for Filters */}
            <div
              className={`fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm flex justify-end transition-opacity duration-300 ${showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
              onClick={() => setShowFilters(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white w-4/5 max-w-sm h-full p-4 overflow-auto shadow-lg transform transition-transform duration-300 ${showFilters ? 'translate-x-0' : 'translate-x-full'
                  }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-600 text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>

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
              </div>
            </div>
          </>}

          {forceShowCreateForm ? (
            <CreateProfileBox onComplete={() => {
              handleProfileComplete();
              setForceShowCreateForm(false); // hide the form after submission
            }} />
          ) : (
            <TaskCompletedBox
              genderFilter={filters.gender}
              ageRangeFilter={filters.ageRange}
              locationFilters={filters.locations}
              languageFilters={filters.languages}
              lookingForFilters={filters.lookingFor}
              likesFilters={filters.likes}
              hasProfile={hasProfile}
              onViewRestrictedProfile={() => setShowSignUpPrompt(true)}
            />
          )
          }
        </main>

        {/* Sidebar - only shown when profile exists and not on mobile */}
        {!isMobile && !forceShowCreateForm && (
          <aside className="hidden lg:block  fixed right-5 h-[calc(90vh)] overflow-y-auto border-r border-gray-200 top-18">
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
        {/* Step 1 & 2: Sign Up modal + MultiStepWizard handled by CreateProfileBox */}
        {showSignUpPrompt && (
          <div className="fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 sm:p-8 shadow-2xl text-center relative">
              <button
                onClick={() => setShowSignUpPrompt(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl">
                    <CircleUserRound />
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-teal-600 mb-2">Create your profile</h2>
                <p className="text-gray-600 text-sm mb-5">
                  In order to access the complete profile of this user, please create and set up your own dating profile first.
                </p>
                <button
                  onClick={() => {
                    setShowSignUpPrompt(false);
                    setForceShowCreateForm(true); // 👈 show form in main content
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full transition-all"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      <MobileNav />
    </div>
  );
}