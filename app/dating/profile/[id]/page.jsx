'use client';
import React from 'react';
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import MobileNav from "../../../components/MobileNav";
import { useIsMobile } from "../../../hooks/use-mobile";
import { LogOut, Pin, ArrowLeft, Lock, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const mockProfile = {
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

export default function ProfilePage({ params }) {
  const isMobile = useIsMobile();
  const { id: profileId } = React.use(params);
  const profile = mockProfile;
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showChatModal, setShowChatModal] = React.useState(false);
  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />

      <div className="md:ml-64 pt-16 px-4 lg:px-8">
        {/* Banner & Profile Pic */}
        <div className="relative bg-gray-300 h-52 w-full rounded-xl">
          <div className="absolute left-6 bottom-[-40px]">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-12">
          <div className="flex items-center mb-6 flex-wrap gap-2 ">
            <div>
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <h3 className="text-xs font-light text-gray-500">@{profile.name}</h3>
              <p className="text-gray-500">{profile.profession} • {profile.location}</p>
            </div>
            <div className="flex gap-2 mb-7">
              <button
                className="bg-gray-300 px-4 py-1 rounded-full text-sm"
                onClick={() => setShowChatModal(true)}
              >
                Message
              </button>

              <button className="bg-white px-4 py-1 rounded-full text-sm">Profile
                <LogOut className="inline ml-1 w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
              </button>
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <p className="text-gray-700 mb-6">{profile.description}</p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 border-t-2">
            <div className="space-y-4 mt-5">
              <Card title="Looking for" items={[profile.lookingFor]} />
              <Card title="My Basics" items={profile.basics} />
              <Card title="Likes" items={profile.likes} />
              <Card title="Languages" items={profile.languages} />
              <Card title="Education" items={profile.education} />
            </div>

            <div className="lg:col-span-3 space-y-6 mt-5">
              <Section title="About Me" text={profile.aboutMe} />
              <Section title="My Ideal Date" text={profile.idealDate} />
              <Section title="What I Bring to The Table" text={profile.whatIBring} />
              <PhotoGallery />
            </div>
          </div>
        </div>
      </div>
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/10">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Start Chat</h2>
            <p className="text-gray-700 mb-6">
              Initiating a conversation with <span className="font-medium">@{profile.name}</span> will incur a charge of <span className="font-semibold">$3.00</span>, which will be deducted from your wallet balance.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowChatModal(false)}
                className="px-6 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowChatModal(false);
                  setShowSuccess(true);
                  setTimeout(() => {
                    setShowSuccess(false);
                    // You can trigger chat open logic here if needed
                  }, 1200);
                }}

                className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/10">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-6 text-center shadow-xl animate-fade">
            <div className="text-4xl text-green-600 mb-3 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-15">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Payment Successful</h2>
            <p className="text-gray-700">
              $3 has been deducted from your wallet. You may now start a conversation with <span className="font-medium">@{profile.name}</span>.
            </p>
          </div>
        </div>
      )}



      <MobileNav />
    </div>
  );
}

const tagEmojis = {
  // Hobbies
  "Painting": "🖌️",
  "Music": "🎶",
  "Movies": "🎬",
  "Reading": "📚",
  "Gaming": "🎮",
  "Photography": "📸",
  "Cooking": "🍳",
  "DIY Art": "🛠️",
  "Fashion": "👗",
  "Writing": "✍️",

  // Personality & Values
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

  // Sports & Fitness
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

  // Food & Drink
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

  // Travel & Lifestyle
  "Hiking": "🥾",
  "Beach Life": "🏖️",
  "Camping life": "🏕️",
  "Road Trip Junkie": "🚗",
  "Fishing trips": "🎣",
  "Spa weekends": "💆‍♀️",
  "History Buff": "🏛️",
  "Wildlife": "🐅",
  "Ski Resort Lover": "🎿",

  // Languages
  "English": "🌐",
  "Spanish": "🌐",
  "French": "🌐",
  "German": "🌐",
  "Mandarin": "🌐",
  "Hindi": "🌐",
  "Japanese": "🌐",
  "Korean": "🌐",

  // Relationship Basics
  "Single": "💔",
  "In a relationship": "❤️",
  "Married": "💍",
  "Straight": "🌈",
  "Gay": "🏳️‍🌈",
  "No Kids": "🚫🧒",
  "Kids": "👶",

  // Education
  "University of Example": "🎓",
  "High School": "🏫",

  // Extras
  "5'8\"": "📏",
  "Casual Dating": "💞",
  "Adventurous": "🧭",
  "Good Listener": "👂",
  "Funny": "😂",
  "Romantic": "🌹",
  "Bookworm": "📖"
};


function Card({ title, items }) {
  return (
    <div className="max-w-xs bg-gray-200 p-4 rounded-xl shadow-sm mb-5">
      <h3 className="font-semibold mb-2 text-sm text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="bg-gray-100 px-3 py-1 text-xs rounded-full border text-gray-700"
          >
            {tagEmojis[item] ? `${tagEmojis[item]} ` : ""}{item}
          </span>
        ))}
      </div>
    </div>
  );
}


function Section({ title, text }) {
  return (
    <div>
      <h2 className="text-md font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-200 p-4 rounded-xl shadow-sm mb-5">{text}</p>
    </div>
  );
}

function PhotoGallery() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
        >
          <Pin className="absolute top-4 right-4 text-gray-400 w-5 h-5 rotate-45 fill-black" />
          {i >= 2 && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
              <Lock className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
