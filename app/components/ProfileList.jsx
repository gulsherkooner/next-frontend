import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ProfileCard = ({ id, name, description, tags }) => (
  <div className="bg-white rounded-xl max-w-full  border border-gray-300 p-4 flex flex-col gap-2">
    <div className="h-24 bg-gray-200 rounded-md mb-2"></div>
    <h3 className="text-sm font-semibold">{name}</h3>
    <p className="text-sm text-gray-600">{description}</p>
    <div className="flex flex-wrap gap-2 text-xs">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full border text-xs"
        >
          {tag}
        </span>
      ))}
    </div>
    <Link href={`/dating/profile/${id}`}>
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
  lookingForFilters = [],
  likesFilters = [],
}) => {
  const profiles = [
    {
      id: 1,
      name: "Emma Johnson",
      age: 28,
      gender: "Female",
      location: "New York",
      profession: "Graphic Designer",
      education: "Rhode Island School of Design",
      description: "Creative soul who loves art galleries and Sunday brunches. Looking for someone to explore the city with.",
      tags: ["Art", "Brunch", "Museums", "Photography", "Casual Dating"],
      image: "/images/profiles/emma.jpg" // You would add actual image paths
    },
    {
      id: 2,
      name: "James Wilson",
      age: 32,
      gender: "Male",
      location: "Brooklyn",
      profession: "Software Engineer",
      education: "MIT",
      description: "Tech nerd by day, amateur chef by night. Love hiking and board game nights.",
      tags: ["Technology", "Cooking", "Hiking", "Board Games", "Serious Relationship"],
      image: "/images/profiles/james.jpg"
    },
    {
      id: 3,
      name: "Sophia Chen",
      age: 26,
      gender: "Female",
      location: "Manhattan",
      profession: "Marketing Manager",
      education: "NYU",
      description: "Foodie and travel enthusiast. Always planning my next adventure - join me?",
      tags: ["Travel", "Food", "Wine", "Yoga", "Open to Casual"],
      image: "/images/profiles/sophia.jpg"
    },
    {
      id: 4,
      name: "Michael Rodriguez",
      age: 30,
      gender: "Male",
      location: "Queens",
      profession: "Personal Trainer",
      education: "University of Miami",
      description: "Fitness coach who believes in balance. Gym, beach, and great conversation.",
      tags: ["Fitness", "Health", "Beach", "Football", "Serious Relationship"],
      image: "/images/profiles/michael.jpg"
    },
    {
      id: 5,
      name: "Olivia Smith",
      age: 27,
      gender: "Female",
      location: "Jersey City",
      profession: "Elementary Teacher",
      education: "Columbia University",
      description: "Bookworm with a passion for education and coffee shops. Let's discuss our favorite novels!",
      tags: ["Reading", "Coffee", "Teaching", "Volunteering", "Long-term"],
      image: "/images/profiles/olivia.jpg"
    },
    {
      id: 6,
      name: "Daniel Kim",
      age: 31,
      gender: "Male",
      location: "Stamford",
      profession: "Financial Analyst",
      education: "University of Pennsylvania",
      description: "Finance professional who unwinds with jazz music and craft cocktails.",
      tags: ["Finance", "Jazz", "Mixology", "Golf", "Serious Relationship"],
      image: "/images/profiles/daniel.jpg"
    },
    {
      id: 7,
      name: "Ava Martinez",
      age: 29,
      gender: "Female",
      location: "Newark",
      profession: "Nurse",
      education: "Rutgers University",
      description: "Compassionate healthcare worker who loves dancing and beach weekends.",
      tags: ["Healthcare", "Dancing", "Beach", "Spanish", "Open-minded"],
      image: "/images/profiles/ava.jpg"
    },
    {
      id: 8,
      name: "Ethan Brown",
      age: 33,
      gender: "Male",
      location: "Brooklyn",
      profession: "Architect",
      education: "Pratt Institute",
      description: "Designing buildings by day, sketching portraits by night. Let's visit some galleries!",
      tags: ["Architecture", "Art", "Design", "Museums", "Casual Dating"],
      image: "/images/profiles/ethan.jpg"
    }
  ];

  const filteredProfiles = profiles.filter(profile => {
    // Gender filter
    if (genderFilter && genderFilter !== "Both" && profile.gender !== genderFilter) {
      return false;
    }

    // Age filter
    if (profile.age < ageRangeFilter[0] || profile.age > ageRangeFilter[1]) {
      return false;
    }

    // Location filter (case insensitive)
    if (locationFilters.length > 0 &&
      !locationFilters.some(loc =>
        profile.location.toLowerCase().includes(loc.toLowerCase())
      )) {
      return false;
    }

    // Language filter (checks profile tags)
    if (languageFilters.length > 0 &&
      !languageFilters.some(lang =>
        profile.tags.some(tag =>
          tag.toLowerCase().includes(lang.toLowerCase())
        )
      )) {
      return false;
    }

    // Looking For filter
    if (lookingForFilters.length > 0 &&
      !lookingForFilters.some(option =>
        profile.tags.some(tag =>
          tag.toLowerCase().includes(option.toLowerCase().split(" ")[0])
        )
      )) {
      return false;
    }

    // Likes filter
    if (likesFilters.length > 0 &&
      !likesFilters.some(like =>
        profile.tags.some(tag =>
          tag.toLowerCase().includes(like.toLowerCase())
        )
      )) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-max mx-auto p-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {genderFilter && genderFilter !== "Both" && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border">
            {genderFilter}
            <span className="ml-2 text-gray-400 cursor-pointer">&times;</span>
          </div>
        )}

        {ageRangeFilter && (
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border">
            Age: {ageRangeFilter[0]}-{ageRangeFilter[1]}
            <span className="ml-2 text-gray-400 cursor-pointer">&times;</span>
          </div>
        )}

        {locationFilters.map((filter, idx) => (
          <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center border">
            {filter}
            <span className="ml-2 text-gray-400 cursor-pointer">&times;</span>
          </div>
        ))}
      </div>

      {/* Profiles */}
      <div className="flex flex-col gap-4">
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile, idx) => (
            <ProfileCard key={idx} {...profile} />
          ))
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
