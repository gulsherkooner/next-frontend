import { Search } from "lucide-react";
const Unlike = ({ likes, setLikes, }) => {

    const categories = {
        "Hobbies": ["Painting", "Music", "Movies", "Gaming", "Photography", "Cooking", "DIY Art", "Fashion", "Writing"],
        "Sports & Fitness": ["Cycling", "Hockey", "Football", "Basketball", "Cricket"],
    };

    const tagEmojis = {
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
        "Fishing trips": "🎣",
        "Spa weekends": "💆‍♀️",
        "History Buff": "🏛️",
        "Wildlife": "🐅",
        "Ski Resort Lover": "🎿"
    };

    return (
        <div className=" bg-gray-200 rounded-lg max-w-xl">
            <h2 className="text-xl font-extrabold mb-2">See less of</h2>
            <p className="text-sm text-gray-600 mb-4">Select topics you’d like to see less of in your feed and explore page.</p>
            <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-white pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
            </div>
            {Object.entries(categories).map(([category, tags]) => (
                <div key={category} className="mt-5">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                className={`px-3 py-1 rounded-full text-sm border ${(Array.isArray(likes) ? likes : []).includes(tag)
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-200 text-black"
                                    }`}
                            >
                                {tagEmojis[tag]} {tag}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
const LikesForm = ({ likes, setLikes, }) => {

    const categories = {
        "Hobbies": ["Painting", "Music", "Movies", "Gaming", "Photography", "Cooking", "DIY Art", "Fashion", "Writing"],
        "Sports & Fitness": ["Cycling", "Hockey", "Football", "Basketball", "Cricket"],
    };

    const tagEmojis = {
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
        "Fishing trips": "🎣",
        "Spa weekends": "💆‍♀️",
        "History Buff": "🏛️",
        "Wildlife": "🐅",
        "Ski Resort Lover": "🎿"
    };

    return (
        <div className=" bg-gray-200 rounded-lg max-w-xl">
            <h2 className="text-xl font-extrabold mb-2">Interested In</h2>
            <p className="text-sm text-gray-600 mb-4">Select topics you'd like to see more of in your feed and explore page.</p>
            <div className="relative">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search"
                    className="bg-white pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
            </div>
            {Object.entries(categories).map(([category, tags]) => (
                <div key={category} className="mt-5">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                className={`px-3 py-1 rounded-full text-sm border ${(Array.isArray(likes) ? likes : []).includes(tag)
                                    ? "bg-black text-white border-black"
                                    : "bg-gray-200 text-black"
                                    }`}
                            >
                                {tagEmojis[tag]} {tag}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
export const Content = () => {
    return (
        <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-scroll">
            <h2 className="text-xl font-extrabold mb-6">Content preferences</h2>
            <hr />
            <div className="space-y-4 p-5">
                <h2 className="text-xl font-extrabold mb-2">Local Content</h2>
                <p className="text-sm text-gray-600 mb-4">Priotize content from your region</p>
                <div className="space-y-2 mb-4">
                    {['On', 'Off'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="apperance"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
                <hr />
                <h2 className="text-xl font-extrabold mb-2">Choose how much sensitive content can you see</h2>
                <p className="text-sm text-gray-600 mb-4">Coontrol how much sensitive content is shown across Explore,Feed and Comments.</p>
                <div className="space-y-2 mb-4">
                    {['None - You’ll see no content that is deemed to be sensitive', 'Less - Only the most filtered content', 'Standard – A balanced mix (default)', 'More – You’ll see more sensitive content'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="colour"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
                <hr />
                <h2 className="text-xl font-extrabold mb-2">Suggested Content Filters</h2>
                <p className="text-sm text-gray-600 mb-4">Control the type of content we suggest out following list.</p>
                <div className="space-y-2 mb-4">
                    {['Show more from accounts I follow', 'Prioritize content from creators I engage with', 'Show more from only verifed accounts'].map((option) => (
                        <label key={option} className="flex items-center space-x-4 transform: scale-100">
                            <input
                                type="radio"
                                name="font"
                                className="scale-150 accent-gray-800"
                            />
                            <span className='font-bold text-lg'>{option}</span>
                        </label>
                    ))}
                </div>
                <hr />
                <LikesForm />
                <hr />
                <Unlike/>
            </div>
        </div>

    );
};