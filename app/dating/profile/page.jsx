'use client';
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import { Pencil, LogOut, Pin, ArrowLeft, Lock, MoreHorizontal } from "lucide-react";

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
    "Mumbai": "🌐",

    // Relationship Basics
    "Single": "💔",
    "In a relationship": "❤️",
    "Serious relationship": "❤️",
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
    "175 cm": "📏",
    "Casual Dating": "💞",
    "Adventurous": "🧭",
    "20": "🧭",
    "Good Listener": "👂",
    "Funny": "😂",
    "Romantic": "🌹",
    "Bookworm": "📖",
    "Software Engineer": "📖"
};

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

function PhotoGallery() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    {i <= 2 && (
                        <Pin className="absolute top-4 right-4 text-gray-400 w-5 h-5 rotate-45 fill-black" />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) setProfile(JSON.parse(saved));
    }, []);

    if (!profile) return <div className="text-center p-10">Loading profile...</div>;

    const basics = [
        `${profile.height ? `${profile.height} cm` : "Height not specified"}`,
        `${profile.age}`,
        ...profile.locations
    ];

    return (
        <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
            <Header />
            <Sidebar />

            <div className="md:ml-64 pt-16 px-4 lg:px-8">
                {/* Banner & Profile Pic */}
                <div className="relative bg-gray-300 h-52 w-full rounded-xl">

                    <div className="w-5 h-5 rounded-full border-5 border-white absolute top-4 right-4 bg-white">
                        <Pencil className=" w-3 h-3 fill-gray-200" />
                    </div>
                    <div className="absolute left-6 bottom-[-40px]">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white" />
                        <div className="w-5 h-5 rounded-full border-5 border-white absolute top-2 right-1 bg-white">
                            <Pencil className=" w-3 h-3 fill-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-12">
                    <div className="flex items-center mb-6 flex-wrap gap-2">
                        <div>
                            <h1 className="text-2xl font-bold">{profile.firstName}</h1>
                            <h3 className="text-xs font-light text-gray-500">@{profile.firstName}</h3>
                            <p className="text-gray-500">{profile.professions[0] || "N/A"} • {profile.locations[0] || "N/A"}</p>
                        </div>
                        <div className="flex gap-2 mb-7">
                            <button className="bg-gray-300 px-4 py-1 rounded-full text-sm">+ Add Photo</button>
                            <button className="bg-white px-4 py-1 rounded-full text-sm">Edit Profile
                                {/* <LogOut className="inline ml-1 w-5 h-5 text-gray-600 hover:text-black cursor-pointer" /> */}
                            </button>
                            <MoreHorizontal className="inline mt-1 w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    <p className="text-gray-700 mb-6">{profile.gender.join(', ')} • {profile.interestedIn.join(', ')}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 border-t-1">
                        <div className="space-y-4 mt-5">
                            <Card title="Looking for" items={profile.lookingFor} />
                            <Card title="My Basics" items={basics} />
                            <Card title="Likes" items={profile.likes} />
                            <Card title="Languages" items={profile.languages} />
                            <Card title="Education" items={profile.professions} />
                        </div>

                        <div className="lg:col-span-3 space-y-6 mt-5">
                            <Section title="About Me" text={profile.describeSelf} />
                            <Section title="My Ideal Date" text={profile.idealDate} />
                            <Section title="What I Bring to The Table" text={profile.greatPartner} />
                            <PhotoGallery />
                        </div>
                    </div>
                </div>
            </div>

            <MobileNav />
        </div>
    );
}
