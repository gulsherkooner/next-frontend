"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { useIsMobile } from "../hooks/use-mobile";
import CreateProfileBox from "../components/CreateDatingProfile";
import FiltersBox from "../components/FiltersBox";
import TaskCompletedBox from "../components/ProfileList";
import WalletCard from "../components/WalletCard";
import { Suspense } from "react";

export default function DatingPage() {
  // Add these state variables to your DatingPage component
  const [filters, setFilters] = useState({
    gender: "Female",
    ageRange: [25, 35],
    distance: 5,
    locations: ["New york"],
    languages: ["English"],
    lookingFor: ["Casual Dating"],
    likes: ["Hiking"],
  });

  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    try {
      const status = localStorage.getItem("datingProfileCompleted");
      if (status === "true") {
        setProfileCompleted(true);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  const handleProfileComplete = () => {
    try {
      localStorage.setItem("datingProfileCompleted", "true");
      setProfileCompleted(true);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />

      <div className="pt-16 px-4 flex flex-col lg:flex-row justify-center gap-6 ">
        {/* Main contentpt-16 md:pl-56 flex md:flex-row */}
        <main
          className={`flex-1 max-w-full md:max-w-sm xl:max-w-2xl 2xl:max-w-2xl mx-auto p-2 sm:p-4 `}
        >
          <Suspense>
            {from === "task" ? (
              <TaskCompletedBox
                genderFilter={filters.gender}
                ageRangeFilter={filters.ageRange}
                locationFilters={filters.locations}
                languageFilters={filters.languages}
                lookingForFilters={filters.lookingFor}
                likesFilters={filters.likes}
              />
            ) : profileCompleted ? (
              <TaskCompletedBox
                genderFilter={filters.gender}
                ageRangeFilter={filters.ageRange}
                locationFilters={filters.locations}
                languageFilters={filters.languages}
                lookingForFilters={filters.lookingFor}
                likesFilters={filters.likes}
              />
            ) : (
              <CreateProfileBox onComplete={handleProfileComplete} />
            )}
          </Suspense>
        </main>

        {/* FiltersBox - responsive positioning */}
        {!isMobile && (
          <aside className="hidden lg:block w-56 fixed right-0 h-[calc(100vh-160px)] overflow-y-auto border-r border-gray-200 top-14">
            {from === "task" || profileCompleted ? <WalletCard /> : <></>}
            <FiltersBox
              gender={filters.gender}
              setGender={(val) => setFilters({ ...filters, gender: val })}
              ageRange={filters.ageRange}
              setAgeRange={(val) => setFilters({ ...filters, ageRange: val })}
              distance={filters.distance}
              setDistance={(val) => setFilters({ ...filters, distance: val })}
              selectedLocations={filters.locations}
              setSelectedLocations={(val) =>
                setFilters({ ...filters, locations: val })
              }
              selectedLanguages={filters.languages}
              setSelectedLanguages={(val) =>
                setFilters({ ...filters, languages: val })
              }
              lookingFor={filters.lookingFor}
              setLookingFor={(val) =>
                setFilters({ ...filters, lookingFor: val })
              }
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
