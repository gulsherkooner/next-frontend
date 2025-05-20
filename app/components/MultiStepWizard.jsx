import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Search } from "lucide-react";
import { locationSuggestions, professionSuggestions } from '../features/suggestionsData';
const FirstNameForm = ({ firstName, setFirstName, onValidation }) => {
    useEffect(() => {
        // Auto-validate when firstName changes
        const isValid = firstName.trim() && firstName.length <= 50;
        onValidation(isValid);
    }, [firstName, onValidation]);

    return (
        <div className="max-w-xl mx-auto p-1 bg-gray-200 rounded-md font-sans">
            <h2 className="text-lg font-semibold mb-1">What's your first name?</h2>
            <p className="text-sm text-gray-600 mb-4">
                Let others know what to call you! Enter your first name to personalize your profile.
            </p>
            <input
                type="text"
                placeholder="Add your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-1"
            />
            {!firstName.trim() && (
                <p className="text-blue-500 text-sm mb-3">First name is required</p>
            )}
            {firstName.length > 50 && (
                <p className="text-red-500 text-sm mb-3">First name must be less than 50 characters</p>
            )}
        </div>
    );
};

const GenderStep = ({ gender, setGender, onValidation }) => {
    useEffect(() => {
        // Auto-validate when gender changes
        onValidation(gender.length > 0);
    }, [gender, onValidation]);

    const handleChange = (option) => {
        setGender([option]);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">What's your gender?</h2>
            <p className="text-sm text-gray-600 mb-4">Select the gender you identify with to help personalize your experience.</p>
            <div className="space-y-2 mb-4">
                {['Male', 'Female', 'Other'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="gender"
                            checked={gender.includes(option)}
                            onChange={() => handleChange(option)}
                            className="form-radio"
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
            {gender.length === 0 && (
                <p className="text-blue-500 text-sm mb-3">Please select your gender</p>
            )}
        </div>
    );
};

const InterestStep = ({ interestedIn, setInterestedIn, onValidation }) => {
    useEffect(() => {
        // Auto-validate when interestedIn changes
        onValidation(interestedIn.length > 0);
    }, [interestedIn, onValidation]);

    const handleChange = (option) => {
        setInterestedIn([option]);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Who are you interested in seeing?</h2>
            <p className="text-sm text-gray-600 mb-4">Let us know who you're interested in connecting with so we can show you the right profiles.</p>
            <div className="space-y-2 mb-4">
                {['Men', 'Women', 'Anyone'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="interest"
                            checked={interestedIn.includes(option)}
                            onChange={() => handleChange(option)}
                            className="form-radio"
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
            {interestedIn.length === 0 && (
                <p className="text-blue-500 text-sm mb-3">Please select who you are interested in</p>
            )}
        </div>
    );
};

const LookingForStep = ({ lookingFor, setLookingFor, onValidation }) => {
    useEffect(() => {
        // Auto-validate when lookingFor changes
        onValidation(lookingFor.length > 0);
    }, [lookingFor, onValidation]);

    const handleChange = (option) => {
        if (lookingFor.includes(option)) {
            setLookingFor(lookingFor.filter(item => item !== option));
        } else {
            setLookingFor([...lookingFor, option]);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">What are you looking for?</h2>
            <p className="text-sm text-gray-600 mb-4">Let others know what you're here for—friendship, dating, or something more serious.</p>
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
                            checked={lookingFor.includes(option)}
                            onChange={() => handleChange(option)}
                            className="form-checkbox"
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
            {lookingFor.length === 0 && (
                <p className="text-blue-500 text-sm mb-3">Please select at least one option</p>
            )}
        </div>
    );
};

const BasicsForm = ({ age, setAge, height, setHeight, drinkFreq = [], setDrinkFreq, smokeFreq = [], setSmokeFreq, onValidation }) => {
    const safeDrinkFreq = Array.isArray(drinkFreq) ? drinkFreq : [];
    const safeSmokeFreq = Array.isArray(smokeFreq) ? smokeFreq : [];

    useEffect(() => {
        const isHeightValid = !height || /^\d+$/.test(height);
        const isDrinkValid = safeDrinkFreq.length > 0;
        const isSmokeValid = safeSmokeFreq.length > 0;
        onValidation(isHeightValid && isDrinkValid && isSmokeValid);
    }, [height, safeDrinkFreq, safeSmokeFreq, onValidation]);

    const handleCheckboxChange = (value, setFunc, currentArray) => {
        const updatedArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        setFunc(updatedArray);
    };


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

    return (
        <div className="p-6 bg-gray-200 rounded-lg max-w-full">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-xl font-semibold">Basics</h2>
                <span className="text-sm text-gray-600">1/3</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you. These details help others see a glimpse of your world at a glance!
            </p>

            <label className="block mb-6 font-bold text-gray-700">Select your age</label>
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
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}

                    className="w-full h-4 appearance-none bg-gradient-to-r from-gray-800 to-gray-300 rounded-full outline-none"
                    style={{
                        height: "5px",
                        background: `linear-gradient(to right, #333 ${(age - 18) / (99 - 18) * 100}%, #ccc ${(age - 18) / (99 - 18) * 100}%)`
                    }}
                />
            </div>

            <label className="block mb-1 font-bold">📏Enter your height (Optional)</label>
            <input
                type="text"
                placeholder="Add your Height in cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 mb-1 border rounded"
            />
            {height && !/^\d+$/.test(height) && (
                <p className="text-red-500 text-sm mb-3">Height must be a number</p>
            )}

            <fieldset className="mb-4">
                <legend className="font-bold mb-2">🧃 How often do you drink?</legend>
                {drinkOptions.map((opt) => (
                    <label key={opt} className="block mb-1">
                        <input
                            type="checkbox"
                            checked={safeDrinkFreq.includes(opt)}
                            onChange={() => handleCheckboxChange(opt, setDrinkFreq, safeDrinkFreq)}
                            className="mr-2"
                        />
                        {opt}
                    </label>
                ))}
                {drinkFreq.length === 0 && (
                    <p className="text-blue-500 text-sm mb-3">Please select at least one option</p>
                )}
            </fieldset>

            <fieldset className="mb-4">
                <legend className="font-bold mb-2">🚬 How often do you smoke?</legend>
                {smokeOptions.map((opt) => (
                    <label key={opt} className="block mb-1">
                        <input
                            type="checkbox"
                            checked={safeSmokeFreq.includes(opt)}
                            onChange={() => handleCheckboxChange(opt, setSmokeFreq, safeSmokeFreq)}
                            className="mr-2"
                        />
                        {opt}
                    </label>
                ))}
                {smokeFreq.length === 0 && (
                    <p className="text-blue-500 text-sm mb-3">Please select at least one option</p>
                )}
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
    onValidation
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

    // Validate form
    useEffect(() => {
        const isValid = safeWorkoutOptions.length > 0 &&
            safeLocations.length > 0 &&
            safeProfessions.length > 0;
        onValidation(isValid);
    }, [safeWorkoutOptions, safeLocations, safeProfessions, onValidation]);

    return (
        <div className="p-6 bg-gray-200 rounded-lg max-w-full">
            {/* Header and intro text */}
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Basics</h2>
                <span className="text-sm text-gray-600">2/3</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you.
            </p>

            {/* Workout Options */}
            <fieldset className="mb-4">
                <legend className="font-bold mb-2">💪 Do you workout?</legend>
                {["Not very active", "Sometimes", "Regularly", "Almost every day"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 mb-1">
                        <input
                            type="checkbox"
                            checked={safeWorkoutOptions.includes(option)}
                            onChange={() => handleWorkoutToggle(option)}
                            className="form-checkbox text-black h-5 w-5"
                        />
                        <span>{option}</span>
                    </label>
                ))}
                {safeWorkoutOptions.length === 0 && (
                    <p className="text-blue-500 text-sm mb-3">Please select at least one option</p>
                )}
            </fieldset>

            {/* Locations */}
            <div className="mb-4">
                <label className="block font-bold mb-1">📍 Where are you from?</label>
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
                {safeLocations.length === 0 && (
                    <p className="text-blue-500 text-sm mb-3">Please add at least one location</p>
                )}
            </div>

            {/* Professions */}
            <div className="mb-4">
                <label className="block font-bold mb-1">
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
                {safeProfessions.length === 0 && (
                    <p className="text-blue-500 text-sm mb-3">Please add at least one profession or education</p>
                )}
            </div>
        </div>
    );
};
const BasicsStepThree = ({ languages, setLanguages, describeSelf, setDescribeSelf, idealDate, setIdealDate, greatPartner, setGreatPartner, onValidation }) => {
    const languageSuggestions = [
        "English", "Spanish", "French", "German", "Mandarin",
        "Hindi", "Arabic", "Portuguese", "Russian", "Japanese"
    ];

    // Suggestion states
    const [languageSuggestionsVisible, setLanguageSuggestionsVisible] = useState(false);
    const [filteredLanguageSuggestions, setFilteredLanguageSuggestions] = useState(languageSuggestions);
    const [languageInputValue, setLanguageInputValue] = useState('');

    useEffect(() => {
        // Auto-validate when relevant fields change
        const isLanguagesValid = languages.length > 0;
        const isDescribeValid = describeSelf.trim().length >= 20;
        const isIdealDateValid = idealDate.trim().length >= 20;
        const isPartnerValid = greatPartner.trim().length >= 20;
        onValidation(isLanguagesValid && isDescribeValid && isIdealDateValid && isPartnerValid);
    }, [languages, describeSelf, idealDate, greatPartner, onValidation]);

    const handleAddLanguage = (value) => {
        if (value && !languages.includes(value)) {
            setLanguages([...languages, value]);
        }
    };

    const handleRemoveLanguage = (lang) => {
        setLanguages((prev) => prev.filter((l) => l !== lang));
    };
    const handleLanguageInputChange = (e) => {
        const value = e.target.value;
        setLanguageInputValue(value);

        if (value.trim() === '') {
            setFilteredLanguageSuggestions(languageSuggestions);
        } else {
            setFilteredLanguageSuggestions(
                languageSuggestions.filter(lang =>
                    lang.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    const handleAddLanguageFromInput = (e) => {
        e.preventDefault();
        const value = languageInputValue.trim();
        if (value && !languages.includes(value)) {
            setLanguages([...languages, value]);
            setLanguageInputValue('');
        }
    };

    return (
        <div className="p-6 bg-gray-200 rounded-lg max-w-full">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Basics</h2>
                <span className="text-sm text-gray-600">3/3</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you. These details help others see a glimpse of your world at a glance!
            </p>

            <div className="mb-4">
                <label className="block font-bold mb-1">🌐 Which languages do you speak?</label>
                <form onSubmit={handleAddLanguageFromInput} className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search language"
                        value={languageInputValue}
                        onChange={handleLanguageInputChange}
                        onFocus={() => setLanguageSuggestionsVisible(true)}
                        onBlur={() => setTimeout(() => setLanguageSuggestionsVisible(false), 200)}
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </form>

                {languageSuggestionsVisible && filteredLanguageSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredLanguageSuggestions.map((suggestion) => (
                            <div
                                key={suggestion}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={() => {
                                    handleAddLanguage(suggestion);
                                    setLanguageInputValue('');
                                    setLanguageSuggestionsVisible(false);
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {languages.map((lang) => (
                        <span
                            key={lang}
                            className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                        >
                            <span>{lang}</span>
                            <button
                                onClick={() => handleRemoveLanguage(lang)}
                                className="ml-1 text-gray-600 hover:text-black"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                {languages.length === 0 && (
                    <p className="text-blue-500 text-sm mb-3">Please add at least one language</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block font-bold mb-1">
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
                <p className="text-xs text-gray-500 text-right">{describeSelf.length}/200</p>
                {describeSelf.trim().length < 20 && (
                    <p className="text-blue-500 text-sm mb-3">Description should be at least 20 characters</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block font-bold mb-1">
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
                <p className="text-xs text-gray-500 text-right">{idealDate.length}/200</p>
                {idealDate.trim().length < 20 && (
                    <p className="text-blue-500 text-sm mb-3">Description should be at least 20 characters</p>
                )}
            </div>

            <div className="mb-4">
                <label className="block font-bold mb-1">
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
                <p className="text-xs text-gray-500 text-right">{greatPartner.length}/200</p>
                {greatPartner.trim().length < 20 && (
                    <p className="text-blue-500 text-sm mb-3">Description should be at least 20 characters</p>
                )}
            </div>
        </div>
    );
};

const LikesForm = ({ likes, setLikes, onValidation }) => {
    const safeLikes = Array.isArray(likes) ? likes : [];
    useEffect(() => {
        // Auto-validate when likes change
        onValidation(likes.length >= 5);
    }, [likes, onValidation]);

    const toggleTag = (tag) => {
        const updatedLikes = safeLikes.includes(tag)
            ? safeLikes.filter(t => t !== tag)
            : [...safeLikes, tag];

        setLikes(updatedLikes); // ✅ Now you're passing an array, not a function
    };
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
            <h2 className="text-xl font-bold mb-1">Likes</h2>
            <p className="text-sm text-gray-600 mb-2">
                Highlight what brings you joy! Whether it's your favorite hobbies, go-to activities, or passions, select the ones that define you best.
            </p>
            <p className="text-sm font-bold mb-4">Pick at least 5 to continue! ({likes.length}/5 selected)</p>
            {likes.length < 5 && (
                <p className="text-blue-500 text-sm mb-3">Please select at least 5 likes</p>
            )}

            {Object.entries(categories).map(([category, tags]) => (
                <div key={category} className="mb-5">
                    <label className="block font-bold mb-1">
                        {categoryEmojis[category] || "📌"} {category}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
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

export default function MultiStepForm({ onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        gender: [],
        interestedIn: [],
        lookingFor: [],
        age: 32,
        height: '',
        drinkFreq: [],
        smokeFreq: [],
        workoutOptions: [],
        locations: [],
        professions: [],
        languages: [],
        describeSelf: '',
        idealDate: '',
        greatPartner: '',
        likes: [],
    });
    // const router = useRouter();

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNext = async () => {
        if (isValid) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
                setIsValid(false);
            } else {
                try {
                    const token = getCookie("accessToken");
                    const userId = localStorage.getItem('userId'); // <-- get userId
                    const fullFormData = {
                        ...formData,
                        user_id: userId, // <-- include userId in body
                    };
                    console.log(fullFormData);
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/dating-profile`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(fullFormData),
                    });

                    if (!response.ok) throw new Error('Signup failed');

                    if (!response.ok) throw new Error('Profile creation failed');

                    const data = await response.json();
                    localStorage.setItem('datingProfileId', data._id);
                    if (onComplete) onComplete();
                    router.push('/dating?from=task');

                } catch (err) {
                    console.error('Error creating form:', err);
                    alert('Error creating profile. Try again.');
                }
            }
        }
    };


    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setIsValid(true); // Assume previous step was valid
        }
    };

    const steps = [
        {
            label: "Name",
            component: <FirstNameForm
                firstName={formData.firstName}
                setFirstName={(val) => updateFormData('firstName', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Gender",
            component: <GenderStep
                gender={formData.gender}
                setGender={(val) => updateFormData('gender', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Interested In",
            component: <InterestStep
                interestedIn={formData.interestedIn}
                setInterestedIn={(val) => updateFormData('interestedIn', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Looking For",
            component: <LookingForStep
                lookingFor={formData.lookingFor}
                setLookingFor={(val) => updateFormData('lookingFor', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Basics 1",
            component: <BasicsForm
                age={formData.age}
                setAge={(val) => updateFormData('age', val)}
                height={formData.height}
                setHeight={(val) => updateFormData('height', val)}
                drinkFreq={Array.isArray(formData.drinkFreq) ? formData.drinkFreq : []}
                setDrinkFreq={(val) => updateFormData('drinkFreq', val)}
                smokeFreq={Array.isArray(formData.smokeFreq) ? formData.smokeFreq : []}
                setSmokeFreq={(val) => updateFormData('smokeFreq', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Basics 2",
            component: <BasicsStepTwo
                workoutOptions={formData.workoutOptions}
                setWorkoutOptions={(val) => updateFormData('workoutOptions', val)}
                locations={formData.locations}
                setLocations={(val) => updateFormData('locations', val)}
                professions={formData.professions}
                setProfessions={(val) => updateFormData('professions', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Basics 3",
            component: <BasicsStepThree
                languages={formData.languages}
                setLanguages={(val) => updateFormData('languages', val)}
                describeSelf={formData.describeSelf}
                setDescribeSelf={(val) => updateFormData('describeSelf', val)}
                idealDate={formData.idealDate}
                setIdealDate={(val) => updateFormData('idealDate', val)}
                greatPartner={formData.greatPartner}
                setGreatPartner={(val) => updateFormData('greatPartner', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        },
        {
            label: "Likes",
            component: <LikesForm
                likes={formData.likes}
                setLikes={(val) => updateFormData('likes', val)}
                onValidation={(valid) => setIsValid(valid)}
            />
        }
    ];


    const totalSteps = steps.length;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-200 shadow rounded-lg">
            <div className="w-full bg-gray-200 h-1 rounded-full mb-6">
                <div
                    className="bg-black h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                ></div>
            </div>

            {steps[currentStep].component}

            <div className="inline-flex gap-3 mt-3">
                <button
                    onClick={handleBack}
                    className="bg-gray-400 text-white px-4 py-2 rounded-full"
                    disabled={currentStep === 0}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className={`px-4 py-2 rounded-full ${isValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    disabled={!isValid}
                >
                    {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                </button>
            </div>
        </div>
    );
};

// export default MultiStepForm;