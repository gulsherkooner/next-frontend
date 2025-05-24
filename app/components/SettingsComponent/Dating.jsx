import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
const FirstNameForm = () => {
    return (
        <div className="max-w-full p-1 bg-gray-200 rounded-md font-sans mt-2 mb-10">
            <h2 className="text-xl font-bold mb-1">Your Name</h2>
            <p className="text-lg text-gray-600 mb-4">
                Let others know what to call you! Enter your first name to personalize your profile.
            </p>
            <input
                type="text"
                placeholder="Add your first name"
                className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-1"
            />
        </div>
    );
};

const GenderStep = () => {
    return (
        <div className='mb-10'>
            <h2 className="text-xl font-bold mb-2">Your gender</h2>
            <p className="text-lg text-gray-600 mb-4">Select the gender you identify with to help personalize your experience.</p>
            <div className="space-y-2 mb-4">
                {['Male', 'Female', 'Other'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="gender"
                            className="scale-150 accent-gray-800"

                        />
                        <span className=' text-xl'>{option}</span>

                    </label>
                ))}
            </div>
        </div>
    );
};

const InterestStep = () => {
    return (
        <div className='mb-10'>
            <h2 className="text-xl font-bold mb-2">Interested In</h2>
            <p className="text-lg text-gray-600 mb-4">Let us know who you're interested in connecting with so we can show you the right profiles.</p>
            <div className="space-y-2 mb-4">
                {['Men', 'Women', 'Anyone'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="intrest"
                            className="scale-150 accent-gray-800"

                        />
                        <span className=' text-xl'>{option}</span>

                    </label>
                ))}
            </div>
        </div>
    );
};

const LookingForStep = () => {
    return (
        <div className='mb-10'>
            <h2 className="text-xl font-semibold mb-2">Looking for</h2>
            <p className="text-lg text-gray-600 mb-4">Let others know what you're here for—friendship, dating, or something more serious.</p>
            <div className="space-y-2 mb-4">
                {[
                    "Serious relationship",
                    "Open to both long-term and casual connections",
                    "Casual, maybe more",
                    "Just for fun",
                    "Hoping to meet new friends",
                    "Still exploring my options"
                ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="scale-150 accent-gray-800"

                        />
                        <span className=' text-xl'>{option}</span>

                    </label>
                ))}
            </div>

        </div>
    );
};

const BasicsForm = () => {
    const drinkOptions = [
        "Never",
        "Occasionally",
        "Socially",
        "Regularly",
        "Trying to cut back",
    ];

    const smokeOptions = [
        "Never",
        "Occasionally",
        "Regularly",
        "Trying to quit",
    ];
    const [age, setAge] = useState(0);
    return (
        <div className=" bg-gray-200 rounded-lg max-w-full mb-10 mt-10">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-bold">Basics</h2>
                <span className="text-sm text-gray-600">1/3</span>
            </div>
            <p className="text-lg text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you. These details help others see a glimpse of your world at a glance!
            </p>
            <label className="block mb-6 font-bold text-gray-700 text-xl">Select your age</label>
            <div className="relative mb-5">
                <div
                    className="absolute -top-5 text-sm font-semibold text-black"
                    style={{
                        left: `calc(${((age - 18) / (99 - 18)) * 100}% - 12px)`
                    }}
                >
                    {age}
                </div>

                <input
                    type="range"
                    min="18"
                    max="99"
                    onChange={(e) => setAge(Number(e.target.value))}
                    value={age}
                    className="w-full h-4 appearance-none bg-gradient-to-r from-gray-800 to-gray-300 rounded-full outline-none accent-gray-400"
                    style={{
                        height: "5px",
                        background: `linear-gradient(to right, #333 ${(age - 18) / (99 - 18) * 100}%, #ccc ${(age - 18) / (99 - 18) * 100}%)`
                    }}
                />
            </div>

            <label className="block mb-3 font-bold text-xl">📏Enter your height (Optional)</label>
            <input
                type="text"
                placeholder="Add your Height in cm"
                className="w-full px-3 py-2 mb-5 border rounded"
            />


            <fieldset className="mb-4">
                <legend className="font-bold mb-2 text-xl">🧃 How often do you drink?</legend>
                {drinkOptions.map((opt) => (
                    <label key={opt} className="block mb-3 text-lg">
                        <input
                            type="checkbox"
                            className="mr-2 accent-gray-400 transform: scale-150"
                        />
                        {opt}
                    </label>
                ))}

            </fieldset>

            <fieldset className="mb-4">
                <legend className="font-bold mb-2 text-xl">🚬 How often do you smoke?</legend>
                {smokeOptions.map((opt) => (
                    <label key={opt} className="block mb-3 text-lg">
                        <input
                            type="checkbox"
                            className="mr-2 accent-gray-400 transform: scale-150"
                        />
                        {opt}
                    </label>
                ))}

            </fieldset>
        </div>
    );
};

const BasicsStepTwo = ({
    workoutOptions = [],
    setWorkoutOptions,
    locations = [],
    setLocations,
    professions = [],
    setProfessions,
}) => {
    // State for input fields
    const [newLocation, setNewLocation] = useState('');
    const [newProfession, setNewProfession] = useState('');

    // Suggestion data
    const locationSuggestions = [
        "New York", "London", "Paris", "Tokyo", "Berlin",
        "Los Angeles", "Chicago", "Toronto", "Sydney", "Mumbai"
    ];

    const professionSuggestions = [
        "Software Engineer", "Doctor", "Teacher", "Graphic Designer",
        "Marketing Manager", "Student", "Entrepreneur", "Artist"
    ];

    // Suggestion visibility states
    const [locationSuggestionsVisible, setLocationSuggestionsVisible] = useState(false);
    const [professionSuggestionsVisible, setProfessionSuggestionsVisible] = useState(false);
    const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState(locationSuggestions);
    const [filteredProfessionSuggestions, setFilteredProfessionSuggestions] = useState(professionSuggestions);

    // Ensure arrays are never undefined
    const safeWorkoutOptions = Array.isArray(workoutOptions) ? workoutOptions : [];
    const safeLocations = Array.isArray(locations) ? locations : [];
    const safeProfessions = Array.isArray(professions) ? professions : [];

    // Handle workout option selection
    const handleWorkoutToggle = (option) => {
        const newOptions = safeWorkoutOptions.includes(option)
            ? safeWorkoutOptions.filter(item => item !== option)
            : [...safeWorkoutOptions, option];
        setWorkoutOptions(newOptions);
    };

    // Handle location input change
    const handleLocationInputChange = (e) => {
        const value = e.target.value;
        setNewLocation(value);

        if (value.trim() === '') {
            setFilteredLocationSuggestions(locationSuggestions);
        } else {
            setFilteredLocationSuggestions(
                locationSuggestions.filter(loc =>
                    loc.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    // Handle adding new location
    const handleAddLocation = (e) => {
        e.preventDefault();
        const trimmedLocation = newLocation.trim();
        if (trimmedLocation && !safeLocations.includes(trimmedLocation)) {
            setLocations([...safeLocations, trimmedLocation]);
            setNewLocation('');
        }
    };

    // Handle profession input change
    const handleProfessionInputChange = (e) => {
        const value = e.target.value;
        setNewProfession(value);

        if (value.trim() === '') {
            setFilteredProfessionSuggestions(professionSuggestions);
        } else {
            setFilteredProfessionSuggestions(
                professionSuggestions.filter(prof =>
                    prof.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    // Handle adding new profession
    const handleAddProfession = (e) => {
        e.preventDefault();
        const trimmedProfession = newProfession.trim();
        if (trimmedProfession && !safeProfessions.includes(trimmedProfession)) {
            setProfessions([...safeProfessions, trimmedProfession]);
            setNewProfession('');
        }
    };

    // Handle removing location
    const handleRemoveLocation = (location) => {
        setLocations(safeLocations.filter(loc => loc !== location));
    };

    // Handle removing profession
    const handleRemoveProfession = (profession) => {
        setProfessions(safeProfessions.filter(prof => prof !== profession));
    };

    return (
        <div className=" bg-gray-200 rounded-lg max-w-full">
            {/* Header and intro text */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Basics</h2>
                <span className="text-sm text-gray-600">2/3</span>
            </div>
            <p className="text-lg text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you.
            </p>

            {/* Workout Options */}
            <fieldset className="mb-8">
                <legend className="font-bold mb-4 text-xl">💪 Do you workout?</legend>
                {["Not very active", "Sometimes", "Regularly", "Almost every day"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 mb-4">
                        <input
                            type="checkbox"
                            className="form-checkbox text-black h-5 w-5"
                        />
                        <span className='text-lg font-medium'>{option}</span>
                    </label>
                ))}
                
            </fieldset>

            {/* Locations */}
            <div className="mb-4">
                <label className="block font-bold mb-4 text-xl">📍 Where are you from?</label>
                <form onSubmit={handleAddLocation} className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search location"
                        value={newLocation}
                        onChange={handleLocationInputChange}
                        onFocus={() => setLocationSuggestionsVisible(true)}
                        onBlur={() => setTimeout(() => setLocationSuggestionsVisible(false), 200)}
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </form>

                {locationSuggestionsVisible && filteredLocationSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredLocationSuggestions.map((suggestion) => (
                            <div
                                key={suggestion}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent input blur
                                    setLocations([...safeLocations, suggestion]);
                                    setNewLocation('');
                                    setLocationSuggestionsVisible(false);
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {safeLocations.map((location) => (
                        <span
                            key={location}
                            className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                        >
                            <span>{location}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveLocation(location)}
                                className="ml-1 text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
               
            </div>

            {/* Professions */}
            <div className="mb-4">
                <label className="block font-bold mb-4 text-xl">
                    🎓 What's your current grind—career, college, or a bit of both?
                </label>
                <form onSubmit={handleAddProfession} className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search profession, college"
                        value={newProfession}
                        onChange={handleProfessionInputChange}
                        onFocus={() => setProfessionSuggestionsVisible(true)}
                        onBlur={() => setTimeout(() => setProfessionSuggestionsVisible(false), 200)}
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </form>

                {professionSuggestionsVisible && filteredProfessionSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredProfessionSuggestions.map((suggestion) => (
                            <div
                                key={suggestion}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Prevent input blur
                                    setProfessions([...safeProfessions, suggestion]);
                                    setNewProfession('');
                                    setProfessionSuggestionsVisible(false);
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {safeProfessions.map((profession) => (
                        <span
                            key={profession}
                            className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                        >
                            <span>{profession}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveProfession(profession)}
                                className="ml-1 text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
const BasicsStepThree = ({ languages, setLanguages, describeSelf, setDescribeSelf, idealDate, setIdealDate, greatPartner, setGreatPartner, }) => {
    const languageSuggestions = [
        "English", "Spanish", "French", "German", "Mandarin",
        "Hindi", "Arabic", "Portuguese", "Russian", "Japanese"
    ];


    return (
        <div className="p-6 bg-gray-200 rounded-lg max-w-full">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Basics</h2>
                <span className="text-sm text-gray-600">3/3</span>
            </div>
            <p className="text-lg text-gray-600 mb-8">
                Get to know the essentials—where you're from, how you live, and what makes you, you. These details help others see a glimpse of your world at a glance!
            </p>

            <div className="mb-8">
                <label className="block font-bold mb-4 text-xl">🌐 Which languages do you speak?</label>
                <form className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search language"
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </form>
            </div>

            <div className="mb-4">
                <label className="block font-bold mb-4 text-xl">
                    How would you describe yourself in a few sentences?
                </label>
                <textarea
                    maxLength={200}
                    rows={3}
                    placeholder="Start typing..."
                    value={describeSelf}
                    onChange={(e) => setDescribeSelf(e.target.value)}
                    className="w-full px-3 py-2 border rounded resize-none"
                />
            </div>

            <div className="mb-4">
                <label className="block font-bold mb-4 text-xl">
                    What does your perfect date night look like?
                </label>
                <textarea
                    maxLength={200}
                    rows={3}
                    placeholder="Start typing..."
                    value={idealDate}
                    onChange={(e) => setIdealDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded resize-none"
                />

            </div>

            <div className="mb-4">
                <label className="block font-bold mb-4 text-xl">
                    What makes you a great partner?
                </label>
                <textarea
                    maxLength={200}
                    rows={3}
                    placeholder="Start typing..."
                    value={greatPartner}
                    onChange={(e) => setGreatPartner(e.target.value)}
                    className="w-full px-3 py-2 border rounded resize-none"
                />

            </div>
        </div>
    );
};

const LikesForm = ({ likes, setLikes, }) => {

    const categories = {
        "Hobbies": ["Painting", "Music", "Movies", "Reading", "Gaming", "Photography", "Cooking", "DIY Art", "Fashion", "Writing"],
        "Personality & Values": ["Dog lover", "Ambitious", "Family oriented", "Open minded", "Romantic", "Confident", "Creative", "Positive", "Sense of adventure", "Sustainable"],
        "Sports & Fitness": ["Tennis", "Running", "Badminton", "Gym-rat", "Yoga", "Kitesurfing", "Cycling", "Hockey", "Football", "Basketball", "Cricket"],
        "Food & Drink": ["Sushi", "Sweet tooth", "Coffee", "Vegetarian", "Whisky", "Foodie", "Pizza", "Wine", "Beer", "Tea"],
        "Travel & Lifestyle": ["Hiking", "Beach Life", "Camping life", "Road Trip Junkie", "Fishing trips", "Spa weekends", "History Buff", "Wildlife", "Ski Resort Lover"]
    };

    const categoryEmojis = {
        "Hobbies": "🎨",
        "Personality & Values": "🧑‍🤝‍🧑",
        "Sports & Fitness": "🏋️‍♂️",
        "Food & Drink": "🍴",
        "Travel & Lifestyle": "🌍"
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
        <div className="p-6 bg-gray-200 rounded-lg max-w-xl">
            <h2 className="text-xl font-bold mb-4">Likes</h2>
            <p className="text-lg text-gray-600 mb-4">
                Highlight what brings you joy! Whether it's your favorite hobbies, go-to activities, or passions, select the ones that define you best.
            </p>


            {Object.entries(categories).map(([category, tags]) => (
                <div key={category} className="mb-5">
                    <label className="block font-bold mb-1">
                        {categoryEmojis[category] || "📌"} {category}
                    </label>
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
export const Dating = () => {
    return (
        <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-y-scroll">
            <h2 className="text-xl font-extrabold mb-6">Dating Profile</h2>
            <div className="space-y-4 border-t-1 p-3">
                <FirstNameForm />
                <GenderStep />
                <InterestStep />
                <LookingForStep />
                <hr />
                <BasicsForm />
                <hr />
                <BasicsStepTwo />
                <hr />
                <BasicsStepThree />
                <hr />
                <LikesForm />
            </div>
        </div>
    )
}