import React from "react";
import { useParams } from "react-router-dom";

// Dummy profile data (ideally should be fetched from API or context)
const profiles = [
  {
    id: "1",
    name: "Emma Johnson",
    age: 28,
    gender: "Female",
    location: "New York",
    description: "Creative soul who loves art galleries and Sunday brunches.",
    about: "Fun-loving girl... cozy nights in with!",
    idealDate: "Start with sushi... spontaneous karaoke session.",
    bringToTable: "Endless supply of fun facts, Spotify playlists, and fries.",
    tags: ["Art", "Museums", "Painting", "Tennis", "Sushi"],
    likes: ["Painting", "Tennis", "Hiking", "Dog lover", "Sushi"],
    languages: ["English", "French", "Spanish"],
    education: ["Duke University", "M.Arch", "Architect"],
    image: "/images/profiles/emma.jpg",
    lookingFor: "Serious relationship"
  }
  // ... add more
];

const ProfileDetails = () => {
  const { id } = useParams();
  const profile = profiles.find(p => p.id === id);

  if (!profile) return <div className="p-6 text-center">Profile not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="bg-gray-200 h-64 w-64 rounded-full mx-auto md:mx-0 mb-4"></div>
        <h2 className="text-2xl font-bold">{profile.name}</h2>
        <p className="text-gray-600">@{profile.name.toLowerCase().replace(" ", "")}</p>
        <p className="text-sm mt-2">{profile.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div><strong>Age:</strong> {profile.age}</div>
          <div><strong>Gender:</strong> {profile.gender}</div>
          <div><strong>Location:</strong> {profile.location}</div>
          <div><strong>Looking For:</strong> {profile.lookingFor}</div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Likes</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.likes.map((like, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full border text-xs">{like}</span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Languages</h3>
          <div className="flex gap-2 mt-2">
            {profile.languages.map((lang, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full border text-xs">{lang}</span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Education</h3>
          <div className="flex gap-2 mt-2">
            {profile.education.map((edu, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full border text-xs">{edu}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <section>
          <h3 className="font-bold">About Me</h3>
          <p className="text-sm mt-1 text-gray-700">{profile.about}</p>
        </section>
        <section>
          <h3 className="font-bold">My Ideal Date</h3>
          <p className="text-sm mt-1 text-gray-700">{profile.idealDate}</p>
        </section>
        <section>
          <h3 className="font-bold">What I Bring to the Table</h3>
          <p className="text-sm mt-1 text-gray-700">{profile.bringToTable}</p>
        </section>

        {/* Locked photos section */}
        <div className="grid grid-cols-3 gap-2 pt-6">
          {Array(6).fill().map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 flex items-center justify-center text-gray-400 border rounded-md">
              🔒
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
