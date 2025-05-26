'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import MobileNav from "../../components/MobileNav";
import { Pencil, MoreHorizontal, Pin } from "lucide-react";
import PostComposerModal from '../../components/datingComponents/Postcomposer';
import EditImage from "../../components/profileComponents/EditImage";
import { getCookie } from '../../lib/utils/cookie'; // if not already imported
import { motion, AnimatePresence } from "framer-motion";
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

function EditableTags({ title, items = [] }) {
    return (
        <Card title={title} items={items} />
    );
}

function Section({ title, text }) {
    return (
        <div>
            <h2 className="text-md font-semibold mb-2">{title}</h2>
            <p className={`text-sm text-gray-700 whitespace-pre-line bg-gray-200 p-4 rounded-xl shadow-sm mb-5}`}>
                {text}
            </p>
        </div>
    );
}

function PhotoGallery({ posts = [] }) {
    const [showImage, setShowImage] = useState(null); // clicked post
    const [pinnedPosts, setPinnedPosts] = useState([]);
    const [showPinFor, setShowPinFor] = useState(null); // which image to show pin menu
    const [localPosts, setLocalPosts] = useState([]);
    const longPressTimeout = useRef(null);
    const token = getCookie("accessToken");
    useEffect(() => {
        const initiallyPinned = posts.filter(p => p.ispinned).map(p => p._id);
        setPinnedPosts(initiallyPinned);
        setLocalPosts(posts);
    }, [posts]);
    const togglePin = async (postId) => {
        const isCurrentlyPinned = pinnedPosts.includes(postId);
        const newPinState = !isCurrentlyPinned;

        setPinnedPosts((prev) =>
            isCurrentlyPinned
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
        setShowPinFor(null); // hide menu

        setLocalPosts(prev =>
            prev.map(post =>
                post._id === postId ? { ...post, ispinned: newPinState } : post
            )
        );

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-posts/pin-post/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // if needed
                    // include auth token here if needed
                },
                body: JSON.stringify({ ispinned: newPinState }),
            });
        } catch (err) {
            console.error('Failed to update pin:', err);
            // Optionally rollback UI change
        }
    };
    const getImageUrl = (imagePath) => {
        if (imagePath.includes("dropbox.com")) {
            return imagePath
                .replace("www.dropbox.com", "dl.dropboxusercontent.com")
                .split("?")[0];
        }
        return imagePath;
    };

    const handleMouseDown = (postId) => {
        longPressTimeout.current = setTimeout(() => {
            setShowPinFor(postId);
        }, 600); // 600ms for long press
    };

    const handleMouseUp = () => {
        clearTimeout(longPressTimeout.current);
    };
    const sortedPosts = [...localPosts].sort((a, b) => {
        if (a.ispinned === b.ispinned) return 0;
        return a.ispinned ? -1 : 1;
    });


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sortedPosts.map((post, i) => {
                const postId = post._id || i;
                const isPinned = post.ispinned;

                return (
                    <div
                        key={i}
                        className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden"
                        onMouseDown={() => handleMouseDown(postId)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={() => handleMouseDown(postId)}
                        onTouchEnd={handleMouseUp}
                    >
                        <img
                            src={getImageUrl(post.image)}
                            alt={post.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setShowImage(post)}
                            onError={() =>
                                console.error("Image failed to load:", getImageUrl(post.image))
                            }
                        />

                        {/* Animated Pin (if pinned) */}
                        {isPinned && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                className="absolute top-4 right-4 z-10"
                            >
                                <Pin className="w-5 h-5 rotate-45 text-gray-800 fill-black" />
                            </motion.div>
                        )}

                        {/* Long-press Pin Menu */}
                        {showPinFor === postId && (
                            <div
                                className="absolute inset-0 bg-black/40 flex items-center justify-center z-20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePin(postId);
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1.1, opacity: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="bg-white text-black rounded-full px-4 py-2 shadow-lg font-semibold"
                                >
                                    {isPinned ? "Unpin" : "Pin"}
                                </motion.div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Fullscreen Modal */}
            {showImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
                    onClick={() => setShowImage(null)}
                >
                    <div className="animate-pop rounded-xl shadow-2xl p-2 bg-white/5">
                        <img
                            src={getImageUrl(showImage.image)}
                            alt={showImage.name || "Full Post"}
                            className="max-w-[70vw] max-h-[70vh] rounded-lg object-contain pointer-events-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}


export default function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);
    const userId = typeof window !== "undefined" && localStorage.getItem("userId");
    // Add these state variables to your ProfilePage component
    const [imgBox, setImgBox] = useState(false);
    const [bannerBox, setBannerBox] = useState(false);
    const [editingImageType, setEditingImageType] = useState(null); // 'profile' or 'banner'
    const [showFullImage, setShowFullImage] = useState(false);
    const [showFullBanner, setShowFullBanner] = useState(false);
    const [userPosts, setUserPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("posts");
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


    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const accessToken = getCookie("accessToken");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-posts/me`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch user posts");

                const data = await res.json();
                setUserPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        if (userId) fetchUserPosts();
    }, [userId]);

    if (loading) return <div className="text-center p-10">Loading profile...</div>;
    if (!profile) return <div className="text-center p-10 text-red-600">Profile not found</div>;

    const basics = [
        profile.height ? `${profile.height} cm` : "175",
        profile.age,
        ...(profile.locations || [])
    ];

    // Add this function to your ProfilePage component
    const handleImageUpdate = async (postFile) => {
        try {
            const MAX_SIZE_MB = 5;
            const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

            if (!ALLOWED_TYPES.includes(postFile.type)) {
                alert("Only JPEG or PNG images are allowed.");
                return;
            }

            if (postFile.size > MAX_SIZE_MB * 1024 * 1024) {
                alert(`Image must be less than ${MAX_SIZE_MB}MB.`);
                return;
            }

            const accessToken = getCookie("accessToken");
            let base64Blob = postFile.blob;
            if (typeof base64Blob === 'string' && base64Blob.startsWith("data:")) {
                base64Blob = base64Blob.split(",")[1];
            }
            if (!['image/jpeg', 'image/png'].includes(postFile.type)) {
                alert("Only JPEG or PNG images are allowed.");
                return;
            }

            const imageData = {
                blob: postFile.blob, // already base64 (no need to re-encode)
                name: `dating-${editingImageType}-${Date.now()}.jpg`,
                type: postFile.type || 'image/jpeg',
                size: postFile.size,
                lastModified: postFile.lastModified || Date.now()
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    [`${editingImageType}_img_data`]: imageData
                }),
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();

            if (editingImageType === 'profile') {
                setProfile({ ...profile, profile_img_url: data.profile_img_url });
            } else {
                setProfile({ ...profile, banner_img_url: data.banner_img_url });
            }

            setImgBox(false);
            setBannerBox(false);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full pb-14 md:pb-0">
            <Header />
            <Sidebar />

            <div className="md:ml-64 pt-16 px-4 lg:px-8">
                {/* Banner & Profile Pic */}
                {/* Banner & Profile Pic */}
                <div className="relative bg-gray-300 h-58 w-full rounded-xl">
                    {profile.banner_img_url?.[0] ? (
                        <img
                            src={profile.banner_img_url[0]}
                            alt="Banner"
                            className="w-full h-full object-cover rounded-xl"
                            onClick={() => setShowFullBanner(true)}

                        />
                    ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                    )}

                    <div className="absolute top-4 right-4">
                        <button
                            onClick={() => {
                                setBannerBox(true);
                                setEditingImageType('banner');
                            }}
                            className="w-5 h-5 rounded-full border-5 border-white bg-white cursor-pointer flex items-center justify-center"
                        >
                            <Pencil className="w-3 h-3 fill-gray-200" />
                        </button>
                    </div>

                    <div className="absolute left-6 bottom-[-40px]">
                        <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white relative">
                            {profile.profile_img_url?.[0] && (
                                <img
                                    src={profile.profile_img_url[0]}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover cursor-pointer"
                                    onClick={() => setShowFullImage(true)}
                                />
                            )}
                            <button
                                onClick={() => {
                                    setImgBox(true);
                                    setEditingImageType('profile');
                                }}
                                className="w-5 h-5 rounded-full border-5 border-white absolute top-2 right-1 bg-white cursor-pointer flex items-center justify-center"
                            >
                                <Pencil className="w-3 h-3 fill-gray-200" />
                            </button>

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
                                onClick={() => { router.push('/settings') }}
                            >Edit Profile
                            </button>


                            <MoreHorizontal className="inline mt-1 w-5 h-5 text-gray-600" />
                        </div>
                    </div>

                    <p className="text-gray-700 mb-6">{profile.gender?.join(', ')} • {profile.interestedIn?.join(', ')}</p>
                    <div className="md:hidden">
                        <div className="flex justify-around mt-6 mb-4 border-b border-gray-300">
                            {["posts", "tags", "about"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 px-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4 mt-4"
                            >
                                {activeTab === "posts" && <PhotoGallery posts={userPosts} />}
                                {activeTab === "tags" && (
                                    <>
                                        <EditableTags
                                            title="Looking for"
                                            items={profile.lookingFor || []}
                                            sectionKey="lookingFor"
                                        />
                                        <EditableTags
                                            title="My Basics"
                                            items={basics || []}
                                            sectionKey="basics"

                                        />

                                        <EditableTags
                                            title="Likes"
                                            items={profile.likes || []}
                                            sectionKey="likes"

                                        />
                                        <EditableTags
                                            title="Languages"
                                            items={profile.languages || []}
                                            sectionKey="languages"

                                        />
                                        <EditableTags
                                            title="Education"
                                            items={profile.professions || []}
                                            sectionKey="professions"

                                        />
                                    </>
                                )}
                                {activeTab === "about" && (
                                    <>
                                        <Section
                                            title="About Me"
                                            text={profile.describeSelf}
                                            sectionKey="describeSelf"

                                        />
                                        <Section
                                            title="My Ideal Date"
                                            text={profile.idealDate}
                                            sectionKey="idealDate"

                                        />
                                        <Section
                                            title="What I Bring to The Table"
                                            text={profile.greatPartner}
                                            sectionKey="greatPartner"

                                        />
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-6 border-t-1">
                        <div className="space-y-4 mt-5">
                            <EditableTags
                                title="Looking for"
                                items={profile.lookingFor || []}
                                sectionKey="lookingFor"

                            />
                            <EditableTags
                                title="My Basics"
                                items={basics || []}
                                sectionKey="basics"
                            />

                            <EditableTags
                                title="Likes"
                                items={profile.likes || []}
                                sectionKey="likes"

                            />
                            <EditableTags
                                title="Languages"
                                items={profile.languages || []}
                                sectionKey="languages"
                            />
                            <EditableTags
                                title="Education"
                                items={profile.professions || []}
                                sectionKey="professions"
                            />
                        </div>

                        <div className="lg:col-span-3 space-y-6 mt-5">
                            <Section
                                title="About Me"
                                text={profile.describeSelf}
                                sectionKey="describeSelf"

                            />
                            <Section
                                title="My Ideal Date"
                                text={profile.idealDate}
                                sectionKey="idealDate"

                            />
                            <Section
                                title="What I Bring to The Table"
                                text={profile.greatPartner}
                                sectionKey="greatPartner"

                            />
                            <PhotoGallery posts={userPosts} />
                        </div>
                    </div>


                </div>
            </div>
            <PostComposerModal showPostModal={showPostModal} setShowPostModal={setShowPostModal} profile={profile} />
            <MobileNav />
            {imgBox && (
                <EditImage
                    setImgBox={setImgBox}
                    imgBox={imgBox}
                    onSave={handleImageUpdate}
                    w={1}
                    h={1}
                />
            )}

            {bannerBox && (
                <EditImage
                    setImgBox={setBannerBox}
                    imgBox={bannerBox}
                    onSave={handleImageUpdate}
                    w={16}
                    h={9}
                />
            )}
            {showFullImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
                    onClick={() => setShowFullImage(false)}
                >
                    <div className="animate-pop rounded-xl shadow-2xl p-2 bg-white/5">
                        <img
                            src={profile.profile_img_url[0]}
                            alt="Full Profile"
                            className="max-w-[70vw] max-h-[70vh] rounded-lg object-contain pointer-events-none"
                        />
                    </div>
                </div>
            )}

            {showFullBanner && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
                    onClick={() => setShowFullBanner(false)}
                >
                    <div className="animate-pop p-2 bg-white/5 rounded-xl shadow-2xl max-w-[95vw] max-h-[80vh]">
                        <img
                            src={profile.banner_img_url[0]}
                            alt="Full Banner"
                            className="w-full h-auto rounded-lg object-contain pointer-events-none"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
