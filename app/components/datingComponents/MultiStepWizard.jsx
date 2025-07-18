import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { locationSuggestions, professionSuggestions } from '../../features/suggestionsData';
import { getCookie } from "../../lib/utils/cookie";
import { Search, Dumbbell, MapPin, Briefcase, Camera } from "lucide-react";

const FirstNameForm = ({ firstName, setFirstName, onValidation }) => {
    const [touched, setTouched] = useState(false);

    const isTooLong = firstName.length > 50;
    const isEmpty = !firstName.trim();
    const isValid = !isEmpty && !isTooLong;

    useEffect(() => {
        // Notify parent only when valid or invalid
        onValidation(isValid);
    }, [firstName, isValid, onValidation]);

    return (
        <div className="max-w-xl mx-auto p-1 rounded-md font-sans">
            <h2 className="text-lg font-bold mb-1">What's your first name?</h2>
            <p className="text-sm text-gray-600 mb-4">
                Let others know what to call you! Enter your first name to personalize your profile.
            </p>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Add your first name"
                    className={`w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-1
            ${touched && isEmpty ? "border-yellow-500 focus:ring-yellow-500" : ""}
            ${touched && isTooLong ? "border-red-500 focus:ring-red-500" : ""}
            ${touched && isValid ? "border-teal-500 focus:ring-teal-500" : ""}
          `}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => setTouched(true)}
                />
            </div>

            {touched && isEmpty && (
                <p className="text-yellow-600 text-sm mb-3">First name is required</p>
            )}
            {touched && isTooLong && (
                <p className="text-red-600 text-sm mb-3">First name must be less than 50 characters</p>
            )}
        </div>
    );
};

const GenderStep = ({ gender, setGender, onValidation }) => {
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        onValidation(gender.length > 0);
    }, [gender, onValidation]);

    const handleChange = (option) => {
        setTouched(true);
        setGender([option]);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">What's your gender?</h2>
            <p className="text-sm text-gray-600 mb-4">
                Select the gender you identify with to help personalize your experience.
            </p>

            <div className="space-y-2 mb-4">
                {['Male', 'Female', 'Other'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="gender"
                            checked={gender.includes(option)}
                            onChange={() => handleChange(option)}
                            className="accent-teal-500"
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>

            {touched && gender.length === 0 && (
                <p className="text-teal-500 text-sm mb-3">Please select your gender</p>
            )}
        </div>
    );
};

const InterestStep = ({ interestedIn, setInterestedIn, onValidation }) => {
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (touched) {
            onValidation(interestedIn.length > 0);
        }
    }, [interestedIn, touched, onValidation]);

    const handleChange = (option) => {
        if (!touched) setTouched(true);
        setInterestedIn([option]);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Who are you interested in seeing?</h2>
            <p className="text-sm text-gray-600 mb-4">
                Let us know who you're interested in connecting with so we can show you the right profiles.
            </p>

            <div className="space-y-2 mb-4">
                {['Men', 'Women', 'Anyone'].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="interest"
                            checked={interestedIn.includes(option)}
                            onChange={() => handleChange(option)}
                            className="accent-teal-500"

                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>

            {touched && interestedIn.length === 0 && (
                <p className="text-teal-500 text-sm mb-3">Please select who you are interested in</p>
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
        setTouched(true);
        if (lookingFor.includes(option)) {
            setLookingFor(lookingFor.filter(item => item !== option));
        } else {
            setLookingFor([...lookingFor, option]);
        }
    };

    const [touched, setTouched] = useState(false);

    const options = [
        "Serious relationship",
        "Open to both long-term and casual connections",
        "Casual, maybe more",
        "Just for fun",
        "Hoping to meet new friends",
        "Still exploring my options"
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">What are you looking for?</h2>
            <p className="text-sm text-gray-600 mb-4">
                Let others know what you're here for—friendship, dating, or something more serious.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {options.map((option) => {
                    const isSelected = lookingFor.includes(option);
                    return (
                        <button
                            key={option}
                            onClick={() => handleChange(option)}
                            type="button"
                            className={`px-4 py-2 text-sm rounded-full border transition
                                ${isSelected
                                    ? "bg-teal-500 text-white border-teal-500"
                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {touched && lookingFor.length === 0 && (
                <p className="text-teal-500 text-sm mb-3">Please select at least one option</p>
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
        <div className="p-6  rounded-lg max-w-full">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Basics</h2>
                <span className="text-sm text-gray-600">1/3</span>
            </div>
            <p className="text-sm text-gray-600 mb-8">
                Get to know the essentials—where you're from, how you live, and what makes you, you. These details help others see a glimpse of your world at a glance!
            </p>

            <label className="block mb-6 font-bold text-gray-700">Select your age</label>
            <div className="relative mb-5">
                <div
                    className="absolute -top-5 text-sm font-semibold text-teal-600"
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

                    className="w-full accent-teal-500 cursor-pointer h-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-800"
                    style={{
                        height: "3px",
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

            <fieldset className="mb-6 mt-8">
                <legend className="font-bold mb-2 text-gray-800 text-lg">🧃 How often do you drink?</legend>

                <div className="space-y-2">
                    {drinkOptions.map((opt) => (
                        <label key={opt} className="block text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={safeDrinkFreq.includes(opt)}
                                onChange={() => handleCheckboxChange(opt, setDrinkFreq, safeDrinkFreq)}
                                className="mr-2 w-4 h-4 accent-teal-500"
                            />
                            {opt}
                        </label>
                    ))}
                </div>

                {drinkFreq.length === 0 && (
                    <p className="text-teal-500 text-sm mt-2">Please select at least one option</p>
                )}
            </fieldset>


            <fieldset className="mb-6 mt-8">

                <legend className="font-bold mb-2 text-gray-800 text-lg">🚬 How often do you smoke?</legend>
                <div className="space-y-2">
                    {smokeOptions.map((opt) => (
                        <label key={opt} className="block text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={safeSmokeFreq.includes(opt)}
                                onChange={() => handleCheckboxChange(opt, setSmokeFreq, safeSmokeFreq)}
                                className="mr-2 w-4 h-4 accent-teal-500"
                            />
                            {opt}
                        </label>
                    ))}
                </div>
                {smokeFreq.length === 0 && (
                    <p className="text-teal-500 text-sm mt-2">Please select at least one option</p>
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
    const [newLocation, setNewLocation] = useState("");
    const [newProfession, setNewProfession] = useState("");

    const locationSuggestions = [
        "New York", "London", "Paris", "Tokyo", "Berlin",
        "Los Angeles", "Chicago", "Toronto", "Sydney", "Mumbai"
    ];

    const professionSuggestions = [
        "Software Engineer", "Doctor", "Teacher", "Graphic Designer",
        "Marketing Manager", "Student", "Entrepreneur", "Artist"
    ];

    const [locationSuggestionsVisible, setLocationSuggestionsVisible] = useState(false);
    const [professionSuggestionsVisible, setProfessionSuggestionsVisible] = useState(false);
    const [filteredLocationSuggestions, setFilteredLocationSuggestions] = useState(locationSuggestions);
    const [filteredProfessionSuggestions, setFilteredProfessionSuggestions] = useState(professionSuggestions);

    const safeWorkoutOptions = Array.isArray(workoutOptions) ? workoutOptions : [];
    const safeLocations = Array.isArray(locations) ? locations : [];
    const safeProfessions = Array.isArray(professions) ? professions : [];

    useEffect(() => {
        const isValid =
            safeWorkoutOptions.length > 0 &&
            safeLocations.length > 0 &&
            safeProfessions.length > 0;
        onValidation(isValid);
    }, [safeWorkoutOptions, safeLocations, safeProfessions, onValidation]);

    const handleWorkoutToggle = (option) => {
        const newOptions = safeWorkoutOptions.includes(option)
            ? safeWorkoutOptions.filter(item => item !== option)
            : [...safeWorkoutOptions, option];
        setWorkoutOptions(newOptions);
    };

    const handleLocationInputChange = (e) => {
        const value = e.target.value;
        setNewLocation(value);
        setFilteredLocationSuggestions(
            value.trim() === ""
                ? locationSuggestions
                : locationSuggestions.filter(loc =>
                    loc.toLowerCase().includes(value.toLowerCase())
                )
        );
    };

    const handleAddLocation = (e) => {
        e.preventDefault();
        const trimmed = newLocation.trim();
        if (trimmed && !safeLocations.includes(trimmed)) {
            setLocations([...safeLocations, trimmed]);
            setNewLocation("");
        }
    };

    const handleProfessionInputChange = (e) => {
        const value = e.target.value;
        setNewProfession(value);
        setFilteredProfessionSuggestions(
            value.trim() === ""
                ? professionSuggestions
                : professionSuggestions.filter(prof =>
                    prof.toLowerCase().includes(value.toLowerCase())
                )
        );
    };

    const handleAddProfession = (e) => {
        e.preventDefault();
        const trimmed = newProfession.trim();
        if (trimmed && !safeProfessions.includes(trimmed)) {
            setProfessions([...safeProfessions, trimmed]);
            setNewProfession("");
        }
    };

    const handleRemoveLocation = (loc) => {
        setLocations(safeLocations.filter(l => l !== loc));
    };

    const handleRemoveProfession = (prof) => {
        setProfessions(safeProfessions.filter(p => p !== prof));
    };

    return (
        <div className="p-6  rounded-lg max-w-full">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Basics</h2>
                <span className="text-sm text-gray-600">2/3</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you.
            </p>

            {/* Workout */}
            <fieldset className="mb-6 mt-8">
                <legend className="font-bold flex items-center gap-2 mb-5 text-sm">
                    <Dumbbell className="text-teal-500" size={18} />
                    Do you workout?
                </legend>
                {["Not very active", "Sometimes", "Regularly", "Almost every day"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 mb-2 text-sm">
                        <input
                            type="checkbox"
                            checked={safeWorkoutOptions.includes(option)}
                            onChange={() => handleWorkoutToggle(option)}
                            className=" accent-teal-500 h-5 w-5"
                        />
                        <span>{option}</span>
                    </label>
                ))}
                {safeWorkoutOptions.length === 0 && (
                    <p className="text-teal-500 text-sm mt-1">Please select at least one option</p>
                )}
            </fieldset>

            {/* Location */}
            <div className="mb-10">
                <label className="font-bold mb-1 text-sm flex items-center gap-2">
                    <MapPin className="text-teal-500" size={18} />
                    Where are you from?
                </label>

                {/* Input Field */}
                <div className="relative w-full mb-4">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search location"
                        value={newLocation}
                        onChange={handleLocationInputChange}
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </div>

                {/* Always visible options */}
                <div className="flex flex-wrap gap-2">
                    {filteredLocationSuggestions.map((loc) => {
                        const isSelected = safeLocations.includes(loc);
                        return (
                            <button
                                key={loc}
                                onClick={() => {
                                    if (isSelected) {
                                        handleRemoveLocation(loc);
                                    } else {
                                        setLocations([...safeLocations, loc]);
                                    }
                                }}
                                type="button"
                                className={`px-4 py-1.5 text-sm rounded-full border transition ${isSelected
                                    ? "bg-teal-500 text-white border-teal-500"
                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {loc}
                            </button>
                        );
                    })}
                </div>

                {/* Validation message */}
                {safeLocations.length === 0 && (
                    <p className="text-teal-500 text-sm mt-3">Please select at least one location</p>
                )}
            </div>


            {/* Profession */}
            <div className="mb-4">
                <label className="font-bold mb-1 text-sm flex items-center gap-2">
                    <Briefcase className="text-teal-500" size={18} />
                    What's your current grind—career, college, or both?
                </label>

                {/* Search input */}
                <div className="relative w-full mb-4">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search profession or college"
                        value={newProfession}
                        onChange={handleProfessionInputChange}
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
                    />
                </div>

                {/* Always visible suggestions as buttons */}
                <div className="flex flex-wrap gap-2">
                    {filteredProfessionSuggestions.map((item) => {
                        const isSelected = safeProfessions.includes(item);
                        return (
                            <button
                                key={item}
                                onClick={() => {
                                    if (isSelected) {
                                        handleRemoveProfession(item);
                                    } else {
                                        setProfessions([...safeProfessions, item]);
                                    }
                                }}
                                type="button"
                                className={`px-4 py-1.5 text-sm rounded-full border transition ${isSelected
                                    ? "bg-teal-500 text-white border-teal-500"
                                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                {safeProfessions.length === 0 && (
                    <p className="text-teal-500 text-sm mt-3">
                        Please add at least one profession or education
                    </p>
                )}
            </div>

        </div>
    );
};

const BasicsStepThree = ({
    languages,
    setLanguages,
    describeSelf,
    setDescribeSelf,
    idealDate,
    setIdealDate,
    greatPartner,
    setGreatPartner,
    onValidation,
}) => {
    const safeLanguages = Array.isArray(languages) ? languages : [];

    const languageSuggestions = [
        "English", "Spanish", "French", "German", "Mandarin",
        "Hindi", "Arabic", "Portuguese", "Russian", "Japanese"
    ];

    const [languageInputValue, setLanguageInputValue] = useState("");

    useEffect(() => {
        const isLanguagesValid = safeLanguages.length > 0;
        const isDescribeValid = describeSelf.trim().length >= 20;
        const isIdealDateValid = idealDate.trim().length >= 20;
        const isPartnerValid = greatPartner.trim().length >= 20;
        onValidation(isLanguagesValid && isDescribeValid && isIdealDateValid && isPartnerValid);
    }, [safeLanguages, describeSelf, idealDate, greatPartner, onValidation]);

    const handleAddLanguage = (value) => {
        if (value && !safeLanguages.includes(value)) {
            setLanguages([...safeLanguages, value]);
        }
    };

    const handleRemoveLanguage = (lang) => {
        setLanguages((prev) => prev.filter((l) => l !== lang));
    };

    const handleLanguageInputChange = (e) => {
        setLanguageInputValue(e.target.value);
    };

    const handleAddLanguageFromInput = (e) => {
        e.preventDefault();
        const value = languageInputValue.trim();
        if (value && !safeLanguages.includes(value)) {
            setLanguages([...safeLanguages, value]);
            setLanguageInputValue("");
        }
    };

    return (
        <div className="p-6 rounded-lg max-w-full">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Basics</h2>
                <span className="text-sm text-gray-600">3/3</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Get to know the essentials—where you're from, how you live, and what makes you, you.
                These details help others see a glimpse of your world at a glance!
            </p>

            <div className="mb-8">
                <label className="block font-bold mb-1">🌐 Which languages do you speak?</label>

                <form onSubmit={handleAddLanguageFromInput} className="relative w-full mb-2">
                    <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Add a custom language"
                        value={languageInputValue}
                        onChange={handleLanguageInputChange}
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-teal-400"
                    />
                </form>

                <div className="flex flex-wrap gap-2 mt-2">
                    {languageSuggestions.map((option) => {
                        const isSelected = safeLanguages.includes(option);
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    isSelected
                                        ? setLanguages(safeLanguages.filter((lang) => lang !== option))
                                        : setLanguages([...safeLanguages, option])
                                }
                                className={`px-4 py-1.5 text-sm rounded-full border transition 
            ${isSelected
                                        ? "bg-teal-500 text-white border-teal-500 hover:bg-teal-600"
                                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                    }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>

                {safeLanguages.length === 0 && (
                    <p className="text-teal-500 text-sm mt-2">Please add at least one language</p>
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
                    <p className="text-teal-500 text-sm mb-3">Description should be at least 20 characters</p>
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
                    <p className="text-teal-500 text-sm mb-3">Description should be at least 20 characters</p>
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
                    <p className="text-teal-500 text-sm mb-3">Description should be at least 20 characters</p>
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
        <div className="p-6 rounded-lg max-w-xl">
            <h2 className="text-xl font-bold mb-1">Likes</h2>
            <p className="text-sm text-gray-600 mb-2">
                Highlight what brings you joy! Whether it's your favorite hobbies, go-to activities, or passions, select the ones that define you best.
            </p>
            <p className="text-sm font-bold mb-4">Pick at least 5 to continue! ({likes.length}/5 selected)</p>


            {Object.entries(categories).map(([category, tags]) => (
                <div key={category} className="mb-8">
                    <label className="block font-bold mb-3">
                        {categoryEmojis[category] || "📌"} {category}
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map(tag => {
                            const isSelected = safeLikes.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 text-sm rounded-full border transition
              ${isSelected
                                            ? "bg-teal-500 text-white border-teal-500 hover:bg-teal-600"
                                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {tagEmojis[tag]} {tag}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

        </div>
    );
};

const PhotoVerificationStep = ({ onValidation }) => {
    const [photoFile, setPhotoFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

    useEffect(() => {
        // Validate only when photo is selected
        onValidation(!!photoFile);
    }, [photoFile, onValidation]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    return (
        <div className="p-6 rounded-lg max-w-xl">
            <h2 className="text-xl font-bold mb-1">Upload a Photo to Verify Your Identity</h2>
            <p className="text-sm text-gray-600 mb-6">
                To keep our community safe and authentic, we require a clear photo of you for identity confirmation. This photo won’t be shown on your profile — it’s only used for verification purposes.
            </p>

            <div className="flex flex-col items-start gap-4 mb-4">
                <label className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 cursor-pointer">
                    <Camera /> Upload Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                    />
                </label>

                {previewURL && (
                    <div className="mt-2">
                        <p className="text-sm font-semibold mb-1">Preview:</p>
                        <img
                            src={previewURL}
                            alt="Uploaded Preview"
                            className="w-40 h-40 object-cover rounded-md border border-gray-300"
                        />
                    </div>
                )}
            </div>
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
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/date/profiles`, {
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
        }, {
            label: "Verify Identity",
            component: <PhotoVerificationStep
                onValidation={(valid) => setIsValid(valid)}
            />
        }
    ];


    const totalSteps = steps.length;

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl border border-teal-100">
            {/* Progress Bar */}
            <div className="w-full bg-teal-100 h-1 rounded-full mb-6">
                <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                ></div>
            </div>

            {/* Step Component */}
            {steps[currentStep].component}

            {/* Navigation Buttons */}
            <div className="inline-flex gap-3 mt-4">
                <button
                    onClick={handleBack}
                    className={`px-4 py-2 rounded-full text-white ${currentStep === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-400 hover:bg-teal-500'
                        }`}
                    disabled={currentStep === 0}
                >
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className={`px-4 py-2 rounded-full transition-all ${isValid
                        ? 'bg-teal-500 hover:bg-teal-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    disabled={!isValid}
                >
                    {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                </button>
            </div>
        </div>
    );
};

// export default MultiStepForm;