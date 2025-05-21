'use client';
import React, { useEffect, useState } from 'react';
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import MobileNav from "../../../components/MobileNav";
import { useIsMobile } from "../../../hooks/use-mobile";
import { LogOut, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import PhotoGallery from '../../../components/datingComponents/PhotoGallery';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../../lib/utils/cookie';

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
export default function ProfilePage({ params }) {
  const Router = useRouter();
  const isMobile = useIsMobile();
  const { id } = React.use(params);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [userBalance, setUserBalance] = useState(null);
  const requiredBalance = 3.0;
  // console.log(params.id);
  useEffect(() => {
    const fetchProfile = async () => {
      // console.log(profileId);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/find-dating-profile/${id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserBalance = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/wallet/${userId}`);
        const data = await res.json();
        setUserBalance(data.balance);
      } catch (err) {
        console.error("❌ Error fetching wallet balance:", err);
      }
    };
    if (showChatModal) fetchUserBalance();
  }, [showChatModal]);
  if (loading) return <div className="p-10">Loading...</div>;
  if (!profile) return <div className="p-10">Profile not found.</div>;

  return (
    <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
      <Header />
      <Sidebar />
      <div className="md:ml-64 pt-16 px-4 lg:px-8">
        {/* Banner */}
        <div className="relative bg-gray-300 h-52 w-full rounded-xl">
          <div className="absolute left-6 bottom-[-40px]">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white" />
          </div>
        </div>

        {/* Main content */}
        <div className="mt-12">
          <div className="flex items-center mb-6 flex-wrap gap-2">
            <div>
              <h1 className="text-2xl font-bold">{profile.firstName}</h1>
              <h3 className="text-xs font-light text-gray-500">@{profile.firstName}</h3>
              <p className="text-gray-500">{profile.professions} • {profile.locations[0]}</p>
            </div>
            <div className="flex gap-2 mb-7">
              <button
                className="bg-gray-300 px-4 py-1 rounded-full text-sm"
                onClick={() => setShowChatModal(true)}
              >
                Message
              </button>
              <button className="bg-white px-4 py-1 rounded-full text-sm">
                Profile
                <LogOut className="inline ml-1 w-5 h-5 text-gray-600 hover:text-black cursor-pointer" />
              </button>
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <p className="text-gray-700 mb-6">{profile.describeSelf}</p>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 border-t-2">
            <div className="space-y-4 mt-5">
              <Card title="Looking for" items={[profile.lookingFor]} />
              <Card title="My Basics" items={[profile.gender, profile.age, profile.height]} />
              <Card title="Likes" items={profile.likes} />
              <Card title="Languages" items={profile.languages} />
              <Card title="Education" items={profile.professions} />
            </div>

            <div className="lg:col-span-3 space-y-6 mt-5">
              <Section title="About Me" text={profile.describeSelf} />
              <Section title="My Ideal Date" text={profile.idealDate} />
              <Section title="What I Bring to The Table" text={profile.greatPartner} />
              <PhotoGallery profile={{ name: profile.name }} />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal and Success Feedback */}
      {showChatModal && userBalance !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/50">
          <div className="bg-gray-100 w-full max-w-xl mx-auto rounded-2xl p-6 text-center shadow-xl">
            {userBalance < requiredBalance ? (
              <>
                <h2 className="text-lg font-semibold mb-4">Insufficient Wallet Balance</h2>
                <p className="text-gray-800 text-sm mb-1">
                  To initiate a conversation, a minimum balance of <strong>$3.00</strong> is required.
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  Your current balance is <strong>${userBalance.toFixed(2)}</strong>,<br />
                  Please add funds to your wallet to proceed.
                </p>
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Optional: redirect to wallet top-up page
                      Router.push("/Wallet");
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-full text-sm font-medium hover:opacity-90"
                  >
                    Add balance
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Start Chat</h2>
                <p className="text-gray-700 mb-6">
                  Initiating a conversation with <span className="font-medium">@{profile.firstName}</span> will incur a charge of <span className="font-semibold">$3.00</span>.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowChatModal(false)}
                    className="px-6 py-2 bg-gray-200 rounded-full text-sm font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const accessToken = getCookie("accessToken");
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/wallet/deduct`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${accessToken}`
                          },
                          body: JSON.stringify({
                            amount: 3,
                            purpose: `Chat Unlock @${profile.firstName}`,
                          }),
                        });

                        const data = await res.json();
                        if (res.ok && data.success) {
                          setShowChatModal(false);
                          setShowSuccess(true);
                          setTimeout(() => {
                            setShowSuccess(false);
                            Router.push("/dating/messages");
                          }, 1200);
                        } else {
                          alert("Failed to deduct $3: " + (data.message || "Unknown error"));
                        }
                      } catch (err) {
                        console.error("Error deducting from wallet:", err);
                        alert("An error occurred while deducting from wallet.");
                      }
                    }}
                    className="px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:opacity-90"
                  >
                    Proceed
                  </button>
                </div>
              </>
            )}
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
              $3 has been deducted. You may now chat with <span className="font-medium">@{profile.firstName}</span>.
            </p>
          </div>
        </div>
      )}
      <MobileNav />
    </div>
  );
}

function Card({ title, items }) {
  return (
    <div className="max-w-xs bg-gray-200 p-4 rounded-xl shadow-sm mb-5">
      <h3 className="font-semibold mb-2 text-sm text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border text-gray-700">
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
