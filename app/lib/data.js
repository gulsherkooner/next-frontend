// lib/data.js

export const profiles = [
  {
    id: "1",
    name: "Emma Johnson",
    age: 28,
    gender: "Female",
    location: "New York",
    description: "Creative soul who loves art galleries and brunches.",
    about: "Fun-loving girl... cozy nights in with!",
    idealDate: "Start with sushi... spontaneous karaoke session.",
    bringToTable: "Fun facts, Spotify playlists, and fries.",
    likes: ["Painting", "Tennis", "Hiking", "Dog lover", "Sushi"],
    languages: ["English", "French", "Spanish"],
    education: ["Duke University", "M.Arch", "Architect"],
    image: "/images/profiles/emma.jpg",
    lookingFor: "Serious relationship",
  },
  // Add more profiles here...
];

export function getAllProfileIds() {
  return profiles.map((profile) => ({ params: { id: profile.id } }));
}

export function getProfileById(id) {
  return profiles.find((profile) => profile.id === id);
}
