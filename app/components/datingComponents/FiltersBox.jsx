import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Search, Pencil } from "lucide-react";

const FiltersBox = ({
    gender,
    setGender,
    ageRange,
    setAgeRange,
    distance,
    setDistance,
    selectedLocations,
    setSelectedLocations,
    selectedLanguages,
    setSelectedLanguages,
    lookingFor,
    setLookingFor,
    likes,
    setLikes
}) => {
    // UI state
    const [showMoreLikes, setShowMoreLikes] = useState(false);

    // Search input states
    const [locationInput, setLocationInput] = useState("");
    const [languageInput, setLanguageInput] = useState("");
    const [likesInput, setLikesInput] = useState("");

    // Suggestion visibility states
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
    const [showLikesSuggestions, setShowLikesSuggestions] = useState(false);

    // Data options
    const locations = ["Jersey city", "New york", "Newark", "Stamford"];
    const languages = ["English", "French", "Spanish", "Mandarin"];
    const likesOptions = ["Hiking", "Reading", "Art", "Music", "Traveling"];

    // Filtered suggestions
    const [filteredLocations, setFilteredLocations] = useState(locations);
    const [filteredLanguages, setFilteredLanguages] = useState(languages);
    const [filteredLikes, setFilteredLikes] = useState(likesOptions);

    // Update filtered suggestions when input changes
    useEffect(() => {
        const filterItems = (input, options) =>
            input.trim() === ''
                ? options
                : options.filter(opt =>
                    opt.toLowerCase().includes(input.toLowerCase())
                );

        setFilteredLocations(filterItems(locationInput, locations));
        setFilteredLanguages(filterItems(languageInput, languages));
        setFilteredLikes(filterItems(likesInput, likesOptions));
    }, [locationInput, languageInput, likesInput]);

    // Helper functions
    const toggleMultiSelect = (value, state, setter) => {
        setter(state.includes(value)
            ? state.filter(v => v !== value)
            : [...state, value]
        );
    };

    const handleAddSuggestion = (value, selectedItems, setSelected, setInput, setShow) => {
        if (!selectedItems.includes(value)) {
            setSelected([...selectedItems, value]);
        }
        setInput("");
        setShow(false);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold">Filters</h2>
                <a href="/dating/profile" className="text-sm inline-flex items-center text-gray-700 font-medium hover:underline">
                    <Pencil className="w-4 h-4 mr-1 text-gray-500" />
                    View profile
                </a>
            </div>

            {/* Gender Filter */}
            <div>
                <label className="font-bold block mb-2">Gender</label>
                <div className="space-y-1">
                    {["Male", "Female", "Both"].map((g) => (
                        <label key={g} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value={g}
                                checked={gender === g}
                                onChange={() => setGender(g)}
                            />
                            <span>{g}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Age Range Slider */}
            <div>
                <label className="font-medium block mb-2">Age</label>
                <p className="text-sm text-gray-600 mb-1">
                    Between {ageRange[0]} and {ageRange[1]}
                </p>

                <div className="relative w-full h-6">
                    {/* Full Track */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded -translate-y-1/2" />

                    {/* Highlighted Track */}
                    <div
                        className="absolute top-1/2 h-1 bg-black rounded -translate-y-1/2"
                        style={{
                            left: `${((ageRange[0] - 18) / (60 - 18)) * 100}%`,
                            width: `${((ageRange[1] - ageRange[0]) / (60 - 18)) * 100}%`,
                        }}
                    />

                    {/* Lower Thumb */}
                    <input
                        type="range"
                        min="18"
                        max="60"
                        value={ageRange[0]}
                        onChange={(e) => {
                            const value = +e.target.value;
                            if (value <= ageRange[1]) setAgeRange([value, ageRange[1]]);
                        }}
                        className="absolute top-1/2 left-0 h-1 w-full appearance-none bg-transparent pointer-events-auto
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-3
                 [&::-webkit-slider-thumb]:h-3
                 [&::-webkit-slider-thumb]:bg-black
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-moz-range-thumb]:w-3
                 [&::-moz-range-thumb]:h-3
                 [&::-moz-range-thumb]:bg-black
                 [&::-moz-range-thumb]:rounded-full
                 [&::-moz-range-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:top-1/2
                 [&::-moz-range-thumb]:top-1/2"
                    />

                    {/* Upper Thumb */}
                    <input
                        type="range"
                        min="18"
                        max="60"
                        value={ageRange[1]}
                        onChange={(e) => {
                            const value = +e.target.value;
                            if (value >= ageRange[0]) setAgeRange([ageRange[0], value]);
                        }}
                        className="absolute top-1/2 left-0 w-full h-1 appearance-none bg-transparent pointer-events-none
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-3
                 [&::-webkit-slider-thumb]:h-3
                 [&::-webkit-slider-thumb]:bg-black
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:pointer-events-auto
                 [&::-moz-range-thumb]:w-3
                 [&::-moz-range-thumb]:h-3
                 [&::-moz-range-thumb]:bg-black
                 [&::-moz-range-thumb]:rounded-full
                 [&::-moz-range-thumb]:cursor-pointer
                 [&::-moz-range-thumb]:pointer-events-auto
                 [&::-webkit-slider-thumb]:top-1/2
                 [&::-moz-range-thumb]:top-1/2"
                    />
                </div>
                <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 14px;
            width: 14px;
            background: #333;
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            margin-top: -9px;
            box-shadow: 0 0 0 2px #333;
          }

          input[type="range"]::-moz-range-thumb {
            height: 14px;
            width: 14px;
            background: #333;
            border: 2px solid white;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 0 2px #333;
          }
        `}</style>
            </div>


            <div className="mt-6">
                <label className="font-medium block mb-2">Distance</label>
                <p className="text-sm text-gray-600 mb-1">Up to {distance} km away</p>

                <div className="relative w-full h-6">
                    {/* Full Track */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded -translate-y-1/2" />

                    {/* Highlighted Track */}
                    <div
                        className="absolute top-1/2 h-1 bg-black rounded -translate-y-1/2"
                        style={{
                            left: `${((1 - 1) / (50 - 1)) * 100}%`, // The starting position is always 0% at the beginning of the slider
                            width: `${((distance - 1) / (50 - 1)) * 100}%`, // Calculate width based on the selected distance
                        }}
                    />

                    {/* Slider */}
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={distance}
                        onChange={(e) => setDistance(+e.target.value)}
                        className="absolute top-1/2 left-0 w-full appearance-none h-1 bg-transparent pointer-events-auto
                 [&::-webkit-slider-thumb]:appearance-none
                 [&::-webkit-slider-thumb]:w-3
                 [&::-webkit-slider-thumb]:h-3
                 [&::-webkit-slider-thumb]:bg-black
                 [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:cursor-pointer
                 [&::-webkit-slider-thumb]:top-1/2
                 [&::-moz-range-thumb]:w-3
                 [&::-moz-range-thumb]:h-3
                 [&::-moz-range-thumb]:bg-black
                 [&::-moz-range-thumb]:rounded-full
                 [&::-moz-range-thumb]:cursor-pointer"
                    />
                </div>
            </div>

            {/* Location Search with Suggestions */}
            <div className="relative">
                <label className="font-bold block mb-2">Location</label>
                <div className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search locations..."
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        onFocus={() => setShowLocationSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                </div>

                {showLocationSuggestions && filteredLocations.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredLocations.map((location) => (
                            <div
                                key={location}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAddSuggestion(
                                        location,
                                        selectedLocations,
                                        setSelectedLocations,
                                        setLocationInput,
                                        setShowLocationSuggestions
                                    );
                                }}
                            >
                                {location}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLocations.map((location) => (
                        <span
                            key={location}
                            className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center"
                        >
                            {location}
                            <button
                                onClick={() => toggleMultiSelect(location, selectedLocations, setSelectedLocations)}
                                className="ml-1 text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Language Search with Suggestions */}
            <div className="relative">
                <label className="font-bold block mb-2">Languages</label>
                <div className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search languages..."
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        onFocus={() => setShowLanguageSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowLanguageSuggestions(false), 200)}
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                </div>

                {showLanguageSuggestions && filteredLanguages.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredLanguages.map((language) => (
                            <div
                                key={language}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAddSuggestion(
                                        language,
                                        selectedLanguages,
                                        setSelectedLanguages,
                                        setLanguageInput,
                                        setShowLanguageSuggestions
                                    );
                                }}
                            >
                                {language}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLanguages.map((language) => (
                        <span
                            key={language}
                            className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center"
                        >
                            {language}
                            <button
                                onClick={() => toggleMultiSelect(language, selectedLanguages, setSelectedLanguages)}
                                className="ml-1 text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Looking For Checkboxes */}
            <div>
                <label className="font-bold block mb-2">Looking For</label>
                <div className="space-y-1">
                    {["Serious Relationship", "Casual Dating", "Any"].map((g) => (
                        <label key={g} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                value={g}
                                checked={lookingFor === g}
                                onChange={() => setLookingFor(g)}
                            />
                            <span>{g}</span>
                        </label>
                    ))}
                </div>
            </div>


            {/* Likes Search with Suggestions */}
            <div className="relative">
                <label className="font-bold block mb-2">Likes</label>
                <div className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search interests..."
                        value={likesInput}
                        onChange={(e) => setLikesInput(e.target.value)}
                        onFocus={() => setShowLikesSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowLikesSuggestions(false), 200)}
                        className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />
                </div>

                {showLikesSuggestions && filteredLikes.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredLikes.map((like) => (
                            <div
                                key={like}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleAddSuggestion(
                                        like,
                                        likes,
                                        setLikes,
                                        setLikesInput,
                                        setShowLikesSuggestions
                                    );
                                }}
                            >
                                {like}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {likes.map((like) => (
                        <span
                            key={like}
                            className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center"
                        >
                            {like}
                            <button
                                onClick={() => toggleMultiSelect(like, likes, setLikes)}
                                className="ml-1 text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>

                <button
                    onClick={() => setShowMoreLikes(!showMoreLikes)}
                    className="text-black-600 flex items-center mt-2 text-sm"
                >
                    {showMoreLikes ? "Show Less" : "Show More"}
                    {showMoreLikes ? (
                        <FaChevronUp className="ml-1" />
                    ) : (
                        <FaChevronDown className="ml-1" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default FiltersBox;