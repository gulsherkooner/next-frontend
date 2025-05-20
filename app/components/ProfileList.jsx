import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCookie } from '../lib/utils/cookie';

const ProfileCard = ({ _id, firstName, describeSelf, likes }) => (
  <div className="bg-white rounded-xl max-w-full border border-gray-300 p-4 flex flex-col gap-2">
    <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
    <h3 className="text-sm font-semibold">{firstName}</h3>
    <p className="text-sm text-gray-600">{describeSelf || "No bio provided."}</p>
    <div className="flex flex-wrap gap-2 text-xs">
      {Array.isArray(likes) && likes.length > 0 ? (
        likes.map((tag, idx) => (
          <span
            key={idx}
            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full border text-xs"
          >
            {tag}
          </span>
        ))
      ) : (
        <span className="text-xs text-gray-400">No likes listed</span>
      )}
    </div>
    <Link href={`/dating/profile/${_id}`}>
      <div className="flex items-center text-sm font-medium text-black mt-2 hover:underline cursor-pointer">
        View profile <ArrowRight className="ml-1 w-4 h-4" />
      </div>
    </Link>
  </div>
);

const ProfileList = ({
  genderFilter,
  ageRangeFilter,
  distanceFilter,
  locationFilters = [],
  languageFilters = [],
  lookingForFilters,
  likesFilters = [],
}) => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // const userId = localStorage.getItem('userId');
        const accessToken = getCookie("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/matches`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            gender: genderFilter,
            ageRange: ageRangeFilter,
            locations: locationFilters,
            languages: languageFilters,
            lookingFor: lookingForFilters,
            likes: likesFilters,
          }),
        });

        const data = await res.json();
        setProfiles(data.profiles);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchProfiles();
  }, [
    genderFilter,
    ageRangeFilter,
    locationFilters,
    languageFilters,
    lookingForFilters,
    likesFilters,
  ]);

  return (
    <div className="max-w-max mx-auto p-4">
      {/* Filters UI Display */}
      <div className="flex flex-wrap gap-2 mb-4">
        {genderFilter && genderFilter !== "Both" && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border">
            {genderFilter}
          </div>
        )}

        {ageRangeFilter && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border">
            Age: {ageRangeFilter[0]}–{ageRangeFilter[1]}
          </div>
        )}

        {locationFilters.map((filter, idx) => (
          <div
            key={idx}
            className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border"
          >
            {filter}
          </div>
        ))}
      </div>

      {/* Profiles List */}
      <div className="flex flex-col gap-4">
        {profiles.length > 0 ? (
          profiles.map((profile) => <ProfileCard key={profile._id} {...profile} />)
        ) : (
          <div className="text-center py-8 text-gray-500">
            No profiles match your current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileList;
