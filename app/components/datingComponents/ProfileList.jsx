import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCookie } from '../../lib/utils/cookie';
const girlProfilePics = [
  "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
];

const tagEmojis = {
  "Painting": "🖌️",
  "Art": "🖌️",
  "Music": "🎶",
  "Movies": "🎬",
  "Reading": "📚",
  "Gaming": "🎮",
  "Photography": "📸",
  "Cooking": "🍳",
  "DIY Art": "🛠️",
  "Fashion": "👗",
  "Writing": "✍️",
  "Dog lover": "🐕",
  "Ambitious": "🏅",
  "Family oriented": "👨‍👩‍👧‍👦",
  "Open minded": "💭",
  "Romantic": "💖",
  "Confident": "💪",
  "Creative": "🎨",
  "Positive": "👍",
  "Sense of adventure": "🌄",
  "Sustainable": "🌱",
  "Tennis": "🎾",
  "Running": "🏃‍♂️",
  "Badminton": "🏸",
  "Gym-rat": "🏋️‍♂️",
  "Yoga": "🧘‍♂️",
  "Kitesurfing": "🏄‍♂️",
  "Cycling": "🚴‍♂️",
  "Hockey": "🏒",
  "Football": "🏈",
  "Basketball": "🏀",
  "Cricket": "🏏",
  "Sushi": "🍣",
  "Sweet tooth": "🍬",
  "Coffee": "☕",
  "Vegetarian": "🥦",
  "Whisky": "🥃",
  "Foodie": "🍽️",
  "Pizza": "🍕",
  "Wine": "🍷",
  "Beer": "🍺",
  "Tea": "🍵",
  "Hiking": "🥾",
  "Beach Life": "🏖️",
  "Camping life": "🏕️",
  "Road Trip Junkie": "🚗",
  "Traveling": "🚗",
  "Fishing trips": "🎣",
  "Spa weekends": "💆‍♀️",
  "History Buff": "🏛️",
  "Wildlife": "🐅",
  "Ski Resort Lover": "🎿"
};
const ProfileCard = ({
  id,
  firstName,
  describeSelf,
  likes,
  gender,
  profile_img_url,
  hasProfile,
  onViewRestrictedProfile,
  index,
}) => (
  <div className="bg-white border border-gray-300 rounded-xl w-full flex flex-col md:flex-row overflow-hidden shadow-sm">
    {/* Left gray section (profile placeholder or image) */}
    <div className="w-full md:w-2/5 bg-gray-300">
      <img
        src={girlProfilePics[1]}
        alt={gender}
        className="w-full h-full rounded object-cover cursor-pointer"
      />
    </div>

    {/* Right section */}
    <div className="w-full md:w-3/4 p-4 flex flex-col gap-2">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{firstName}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {describeSelf || "No bio provided."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs mt-3">
        {Array.isArray(likes) && likes.length > 0 ? (
          likes.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full border flex items-center gap-1"
            >
              {tagEmojis[tag]}{tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400">No likes listed</span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          if (!hasProfile) {
            onViewRestrictedProfile();
          } else {
            window.location.href = `/dating/profile/${id}`;
          }
        }}
        className="text-sm text-gray-700 font-medium hover:underline mt-1 text-left"
      >
        View profile
        <ArrowRight className="inline mx-2 w-4" />
      </button>
    </div>
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
  hasProfile,
  onViewRestrictedProfile,
}) => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // const userId = localStorage.getItem('userId');
        const accessToken = getCookie("accessToken");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/matches`, {
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
        console.log(data);
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
  const randomIndex = Math.floor(Math.random() * girlProfilePics.length);
  return (
    <div className="max-w-lg -mx-7 p-4">
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
        {profiles?.length > 0 ? (
          profiles.map((profile) => <ProfileCard key={profile.id} {...profile} hasProfile={hasProfile}
            onViewRestrictedProfile={onViewRestrictedProfile} randomIndex />)
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
