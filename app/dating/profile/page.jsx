'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import { Pencil, MoreHorizontal, Pin } from "lucide-react";
import PostComposerModal from '../../components/Postcomposer';
import MultiStepForm from '../../components/profileComponents/MultiStepWizard';

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

function EditableTags({ title, items = [], sectionKey, onSave, userId, inlineEditEnabled }) {
    const [editing, setEditing] = useState(false);
    const [tempTags, setTempTags] = useState(items);
    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        if (!inlineEditEnabled) setEditing(false);
    }, [inlineEditEnabled]);

    const saveTags = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [sectionKey]: tempTags }),
            });

            if (!res.ok) throw new Error("Failed to update tags");

            onSave(tempTags);
            setEditing(false);
        } catch (err) {
            console.error("Failed to update tags:", err);
            alert("Error saving tags");
        }
    };

    const removeTag = (tag) => setTempTags(tempTags.filter(t => t !== tag));
    const addTag = () => {
        if (newTag && !tempTags.includes(newTag)) {
            setTempTags([...tempTags, newTag]);
            setNewTag("");
        }
    };

    return (
        <div className="max-w-xs bg-gray-200 p-4 rounded-xl shadow-sm mb-5">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
                {inlineEditEnabled && (
                    <button onClick={() => setEditing(!editing)} className="text-xs text-blue-600">
                        {editing ? "Cancel" : "Edit"}
                    </button>
                )}
            </div>

            {editing ? (
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tempTags.map((tag, i) => (
                            <span key={i} className="bg-white px-3 py-1 text-xs rounded-full border text-gray-700 flex items-center gap-1">
                                {tag}{' '}
                                <button onClick={() => removeTag(tag)} className="ml-1 text-red-500">×</button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="px-2 py-1 text-xs border rounded"
                            placeholder="Add new tag"
                        />
                        <button onClick={addTag} className="text-sm bg-blue-500 text-white px-2 rounded">Add</button>
                    </div>
                    <button onClick={saveTags} className="text-sm bg-green-500 text-white px-4 py-1 rounded">Save</button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <span key={i} className="bg-gray-100 px-3 py-1 text-xs rounded-full border text-gray-700">
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function Section({ title, text, sectionKey, onSave, editingSection, setEditingSection, userId, inlineEditEnabled }) {
    const [tempText, setTempText] = useState(text || "");
    const isEditing = editingSection === sectionKey;

    const handleSave = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [sectionKey]: tempText }),
            });
            if (!res.ok) throw new Error("Failed to update section");
            onSave(tempText);
            setEditingSection(null);
        } catch (err) {
            console.error("Save failed:", err);
            alert("Error saving section.");
        }
    };

    return (
        <div>
            <h2 className="text-md font-semibold mb-2">{title}</h2>
            {isEditing ? (
                <div>
                    <textarea
                        className="w-full p-2 border rounded bg-white text-sm"
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        rows={4}
                    />
                    <div className="mt-2 flex gap-2">
                        <button onClick={handleSave} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                        <button onClick={() => setEditingSection(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Cancel</button>
                    </div>
                </div>
            ) : (
                <p
                    className={`text-sm text-gray-700 whitespace-pre-line bg-gray-200 p-4 rounded-xl shadow-sm mb-5 ${inlineEditEnabled ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                        if (inlineEditEnabled) setEditingSection(sectionKey);
                    }}
                >
                    {text || (inlineEditEnabled ? "Click to add description" : "No description")}
                </p>
            )}
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
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [inlineEditEnabled, setInlineEditEnabled] = useState(false);
    const userId = typeof window !== "undefined" && localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
        setLoading(true);

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-profile/${userId}`);
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    if (loading) return <div className="text-center p-10">Loading profile...</div>;
    if (!profile) return <div className="text-center p-10 text-red-600">Profile not found</div>;

    if (isEditing) {
        return (
            <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
                <Header />
                <Sidebar />
                <div className="md:ml-64 pt-16 px-4 lg:px-8">
                    <MultiStepForm
                        onComplete={(updatedProfile) => {
                            setProfile(updatedProfile);
                            setIsEditing(false);
                        }}
                        initialData={profile}
                    />
                </div>
                <MobileNav />
            </div>
        );
    }

    const basics = [
        profile.height ? `${profile.height} cm` : "Height not specified",
        profile.age,
        ...(profile.locations || [])
    ];

    return (
        <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
            <Header />
            <Sidebar />

            <div className="md:ml-64 pt-16 px-4 lg:px-8">
                {/* Banner & Profile Pic */}
                <div className="relative bg-gray-300 h-52 w-full rounded-xl">
                    <div className="w-5 h-5 rounded-full border-5 border-white absolute top-4 right-4 bg-white cursor-pointer"
                        onClick={() => setIsEditing(true)}>
                        <Pencil className="w-3 h-3 fill-gray-200" />
                    </div>
                    <div className="absolute left-6 bottom-[-40px]">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white" />
                        <div className="w-5 h-5 rounded-full border-5 border-white absolute top-2 right-1 bg-white cursor-pointer"
                            onClick={() => setIsEditing(true)}>
                            <Pencil className="w-3 h-3 fill-gray-200" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-12">
                    <div className="flex items-center mb-6 flex-wrap gap-2">
                        <div>
                            <h1 className="text-2xl font-bold">{profile.firstName}</h1>
                            <h3 className="text-xs font-light text-gray-500">@{profile.firstName}</h3>
                            <p className="text-gray-500">{profile.professions?.[0] || "N/A"} • {profile.locations?.[0] || "N/A"}</p>
                        </div>
                        <div className="flex gap-2 mb-7">
                            <button className="bg-gray-300 px-4 py-1 rounded-full text-sm"
                                onClick={() => setShowPostModal(true)}>
                                + Add Photo
                            </button>
                            <button
                                className="bg-white px-4 py-1 rounded-full text-sm"
                                onClick={() => setInlineEditEnabled(!inlineEditEnabled)}
                            >
                                {inlineEditEnabled ? "Done Editing" : "Edit Profile"}
                            </button>


                            <MoreHorizontal className="inline mt-1 w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    <p className="text-gray-700 mb-6">{profile.gender?.join(', ')} • {profile.interestedIn?.join(', ')}</p>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 border-t-1">
                        <div className="space-y-4 mt-5">
                            <EditableTags
                                title="Looking for"
                                items={profile.lookingFor || []}
                                sectionKey="lookingFor"
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                                onSave={(updated) => setProfile({ ...profile, lookingFor: updated })}
                            />
                            <EditableTags
                                title="My Basics"
                                items={profile.lookingFor || []}
                                sectionKey="basics"
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                                onSave={(updated) => setProfile({ ...profile, basics: updated })}
                            />
                            
                            <EditableTags
                                title="Likes"
                                items={profile.likes || []}
                                sectionKey="likes"
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                                onSave={(updated) => setProfile({ ...profile, likes: updated })}
                            />
                            <EditableTags
                                title="Languages"
                                items={profile.languages || []}
                                sectionKey="languages"
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                                onSave={(updated) => setProfile({ ...profile, languages: updated })}
                            />
                            <EditableTags
                                title="Education"
                                items={profile.professions || []}
                                sectionKey="professions"
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                                onSave={(updated) => setProfile({ ...profile, professions: updated })}
                            />
                        </div>

                        <div className="lg:col-span-3 space-y-6 mt-5">
                            <Section
                                title="About Me"
                                text={profile.describeSelf}
                                sectionKey="describeSelf"
                                editingSection={editingSection}
                                setEditingSection={setEditingSection}
                                onSave={(val) => setProfile({ ...profile, describeSelf: val })}
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                            />
                            <Section
                                title="My Ideal Date"
                                text={profile.idealDate}
                                sectionKey="idealDate"
                                editingSection={editingSection}
                                setEditingSection={setEditingSection}
                                onSave={(val) => setProfile({ ...profile, idealDate: val })}
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                            />
                            <Section
                                title="What I Bring to The Table"
                                text={profile.greatPartner}
                                sectionKey="greatPartner"
                                editingSection={editingSection}
                                setEditingSection={setEditingSection}
                                onSave={(val) => setProfile({ ...profile, greatPartner: val })}
                                userId={userId}
                                inlineEditEnabled={inlineEditEnabled}
                            />
                            <PhotoGallery />
                        </div>
                    </div>


                </div>
            </div>
            <PostComposerModal showPostModal={showPostModal} setShowPostModal={setShowPostModal} />
            <MobileNav />
        </div>
    );
}
