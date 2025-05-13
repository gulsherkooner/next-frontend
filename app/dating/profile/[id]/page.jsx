'use client';
import React from 'react';
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import MobileNav from "../../../components/MobileNav";
import { useIsMobile } from "../../../hooks/use-mobile";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

const ProfileDetails = ({ params }) => {
  const isMobile = useIsMobile();
  const profileId = params.id;

  // Dummy data matching the screenshot structure
  const profile = {
    id: 1,
    name: "Username",
    age: 28,
    profession: "Professional",
    location: "New York",
    description: "Username does not affect connection adjusting dll. More valuable items account adjusting dll. More will/from them date of arrest, connection adjusting dll. More validates there.",
    lookingFor: "Casual Dating",
    basics: ["5'8\"", "Straight", "Single", "No Kids"],
    likes: ["Hiking", "Photography", "Coffee"],
    languages: ["English", "Spanish"],
    education: ["University of Example"],
    aboutMe: "My friend is a founding girl who enjoys matching our shoes and trying out different clothes. When he met working, you can find me at the hotel coffee shop, a good look we call things with hands. When a good laugh and appreciate someone who can make me smile, looking for someone to draw adventures and carry nights to whir!",
    idealDate: "We start with their financial mail judge pro board on your corporate skills. You back up on an injury whose wounds are therefore inadequate for painters. But the right with a spontaneous lunatic session.",
    whatIBring: "An endless supply of random fun facts, killer Spotify playlists, and a solid commitment to sharing my free."
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />

      <div className="pt-16 px-4 flex flex-col lg:flex-row justify-center gap-6">
        <main
          className={`w-full max-w-md sm:max-w-xl md:max-w-xl lg:max-w-5xl xl:max-w-6xl md:ml-64 ${
            !isMobile && 'lg:max-w-[calc(100%-22rem)]'
          }`}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* Back button */}
            <Link href="/dating" className="flex items-center text-gray-600 mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to profiles
            </Link>

            {/* Profile header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/3">
                <div className="bg-gray-200 rounded-xl aspect-square w-full"></div>
              </div>
              <div className="w-full md:w-2/3">
                <h1 className="text-2xl font-bold mb-2">{profile.name}, {profile.age}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <span>{profile.profession}</span>
                  <span className="mx-2">•</span>
                  <span>{profile.location}</span>
                </div>
                <p className="text-gray-700 mb-4">{profile.description}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.lookingFor && (
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full border text-xs">
                      {profile.lookingFor}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid layout for summary and details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold mb-2">Looking for</h3>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm">{profile.lookingFor}</div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">My Basics</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {profile.basics.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Likes</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {profile.likes.map((like, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700"
                      >
                        {like}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {profile.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Education</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {profile.education.map((edu, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-3 py-1 rounded-full border text-gray-700"
                      >
                        {edu}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel (spans 2 columns on large screens) */}
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-2">About Me</h2>
                  <p className="text-gray-700 whitespace-pre-line">{profile.aboutMe}</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">My Ideal Date</h2>
                  <p className="text-gray-700 whitespace-pre-line">{profile.idealDate}</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-2">What I Bring to The Table</h2>
                  <p className="text-gray-700 whitespace-pre-line">"{profile.whatIBring}"</p>
                </section>

                {/* Locked photos section */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Array(6)
                    .fill(0)
                    .map((_, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                      >
                        {idx >= 2 && (
                          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
                            <Lock className="w-6 h-6 text-gray-500" />
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default ProfileDetails;