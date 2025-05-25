import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCookie } from '../../lib/utils/cookie';
const api_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
const FirstNameForm = ({ value, onChange }) => (
  <div className="max-w-full p-1 bg-gray-200 rounded-md font-sans mt-2 mb-10">
    <h2 className="text-xl font-bold mb-1">Your Name</h2>
    <p className="text-lg text-gray-600 mb-4">
      Let others know what to call you! Enter your first name to personalize your profile.
    </p>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Add your first name"
      className="bg-white w-full p-2 rounded-xl border border-gray-300 mb-1"
    />
  </div>
);

const GenderStep = ({ value, onChange }) => (
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
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <span className='text-xl'>{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const InterestStep = ({ value, onChange }) => (
  <div className='mb-10'>
    <h2 className="text-xl font-bold mb-2">Interested In</h2>
    <p className="text-lg text-gray-600 mb-4">Let us know who you're interested in connecting with so we can show you the right profiles.</p>
    <div className="space-y-2 mb-4">
      {['Men', 'Women', 'Anyone'].map((option) => (
        <label key={option} className="flex items-center space-x-2">
          <input
            type="radio"
            name="interest"
            className="scale-150 accent-gray-800"
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <span className='text-xl'>{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const LookingForStep = ({ value, onChange }) => {
  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };
  return (
    <div className='mb-10'>
      <h2 className="text-xl font-semibold mb-2">Looking for</h2>
      <p className="text-lg text-gray-600 mb-4">Let others know what you're here for—friendship, dating, or something more serious.</p>
      <div className="space-y-2 mb-4">
        {["Serious relationship", "Open to both long-term and casual connections", "Casual, maybe more", "Just for fun", "Hoping to meet new friends", "Still exploring my options"].map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggleOption(option)}
              className="scale-150 accent-gray-800"
            />
            <span className='text-xl'>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const BasicsForm = ({ age, setAge, height, setHeight, drinks, setDrinks, smokes, setSmokes }) => {
  const drinkOptions = ["Never", "Occasionally", "Socially", "Regularly", "Trying to cut back"];
  const smokeOptions = ["Never", "Occasionally", "Regularly", "Trying to quit"];

  const toggle = (value, list, setter) => {
    if (list.includes(value)) setter(list.filter(v => v !== value));
    else setter([...list, value]);
  };

  return (
    <div className="bg-gray-200 rounded-lg max-w-full mb-10 mt-10">
      <h2 className="text-xl font-bold mb-2">Basics</h2>
      <label className="block mb-6 font-bold text-gray-700 text-xl">Select your age</label>
      <div className="relative mb-5">
        <div
          className="absolute -top-5 text-sm font-semibold text-black"
          style={{ left: `calc(${((age - 18) / (99 - 18)) * 100}% - 12px)` }}
        >
          {age}
        </div>
        <input
          type="range"
          min="18"
          max="99"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="w-full h-4 bg-gradient-to-r from-gray-800 to-gray-300 rounded-full accent-gray-400"
        />
      </div>
      <label className="block mb-3 font-bold text-xl">📏Enter your height (Optional)</label>
      <input
        type="text"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Add your Height in cm"
        className="w-full px-3 py-2 mb-5 border rounded"
      />
      <fieldset className="mb-4">
        <legend className="font-bold mb-2 text-xl">🧃 How often do you drink?</legend>
        {drinkOptions.map((opt) => (
          <label key={opt} className="block mb-3 text-lg">
            <input
              type="checkbox"
              checked={drinks.includes(opt)}
              onChange={() => toggle(opt, drinks, setDrinks)}
              className="mr-2 accent-gray-400"
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
              checked={smokes.includes(opt)}
              onChange={() => toggle(opt, smokes, setSmokes)}
              className="mr-2 accent-gray-400"
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
  const [newLocation, setNewLocation] = useState('');
  const [newProfession, setNewProfession] = useState('');

  const locationSuggestions = ["New York", "London", "Paris"];
  const professionSuggestions = ["Software Engineer", "Doctor", "Teacher"];

  const handleToggle = (value, list, setList) => {
    if (list.includes(value)) setList(list.filter((item) => item !== value));
    else setList([...list, value]);
  };

  return (
    <div className="bg-gray-200 rounded-lg max-w-full">
      <h2 className="text-xl font-bold mb-4">Basics - Step 2</h2>

      <fieldset className="mb-6">
        <legend className="font-bold mb-2 text-xl">💪 Do you workout?</legend>
        {["Not very active", "Sometimes", "Regularly", "Almost every day"].map((option) => (
          <label key={option} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={workoutOptions.includes(option)}
              onChange={() => handleToggle(option, workoutOptions, setWorkoutOptions)}
              className="form-checkbox text-black h-5 w-5"
            />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>

      <div className="mb-6">
        <label className="font-bold text-xl">📍 Where are you from?</label>
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!locations.includes(newLocation)) {
                setLocations([...locations, newLocation]);
                setNewLocation('');
              }
            }
          }}
          placeholder="Type and press Enter"
          className="w-full px-3 py-2 border rounded mt-2"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {locations.map((loc) => (
            <span key={loc} className="bg-gray-300 px-2 py-1 rounded-full text-sm">
              {loc}
              <button onClick={() => setLocations(locations.filter((l) => l !== loc))} className="ml-1">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="font-bold text-xl">🎓 Profession</label>
        <input
          type="text"
          value={newProfession}
          onChange={(e) => setNewProfession(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!professions.includes(newProfession)) {
                setProfessions([...professions, newProfession]);
                setNewProfession('');
              }
            }
          }}
          placeholder="Type and press Enter"
          className="w-full px-3 py-2 border rounded mt-2"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {professions.map((prof) => (
            <span key={prof} className="bg-gray-300 px-2 py-1 rounded-full text-sm">
              {prof}
              <button onClick={() => setProfessions(professions.filter((p) => p !== prof))} className="ml-1">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const BasicsStepThree = ({
  languages = [],
  setLanguages,
  describeSelf,
  setDescribeSelf,
  idealDate,
  setIdealDate,
  greatPartner,
  setGreatPartner,
}) => {
  const [newLang, setNewLang] = useState('');

  const handleAddLanguage = (e) => {
    e.preventDefault();
    if (newLang && !languages.includes(newLang)) {
      setLanguages([...languages, newLang]);
      setNewLang('');
    }
  };

  const handleRemoveLanguage = (lang) => {
    setLanguages(languages.filter((l) => l !== lang));
  };

  return (
    <div className="p-6 bg-gray-200 rounded-lg max-w-full">
      <h2 className="text-xl font-bold mb-4">Basics - Step 3</h2>

      <form onSubmit={handleAddLanguage} className="mb-4">
        <label className="font-bold text-xl">🌐 Languages</label>
        <input
          type="text"
          value={newLang}
          onChange={(e) => setNewLang(e.target.value)}
          placeholder="Type and press Enter"
          className="w-full px-3 py-2 border rounded mt-2"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {languages.map((lang) => (
            <span key={lang} className="bg-gray-300 px-2 py-1 rounded-full text-sm">
              {lang}
              <button onClick={() => handleRemoveLanguage(lang)} className="ml-1">×</button>
            </span>
          ))}
        </div>
      </form>

      <div className="mb-4">
        <label className="font-bold text-xl">Describe Yourself</label>
        <textarea
          rows={3}
          value={describeSelf}
          onChange={(e) => setDescribeSelf(e.target.value)}
          className="w-full px-3 py-2 border rounded mt-2 resize-none"
        />
      </div>

      <div className="mb-4">
        <label className="font-bold text-xl">Ideal Date</label>
        <textarea
          rows={3}
          value={idealDate}
          onChange={(e) => setIdealDate(e.target.value)}
          className="w-full px-3 py-2 border rounded mt-2 resize-none"
        />
      </div>

      <div className="mb-4">
        <label className="font-bold text-xl">What Makes You a Great Partner</label>
        <textarea
          rows={3}
          value={greatPartner}
          onChange={(e) => setGreatPartner(e.target.value)}
          className="w-full px-3 py-2 border rounded mt-2 resize-none"
        />
      </div>
    </div>
  );
};

const LikesForm = ({ likes, setLikes }) => {
  const safeLikes = Array.isArray(likes) ? likes : [];


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

export { FirstNameForm, GenderStep, InterestStep, LookingForStep, BasicsForm, LikesForm };

export const Dating = ({ data }) => {
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [gender, setGender] = useState(data.gender[0] || '');
  const [interest, setInterest] = useState(data.interestedIn[0] || '');
  const [lookingFor, setLookingFor] = useState(data.lookingFor || []);
  const [age, setAge] = useState(data.age || 18);
  const [height, setHeight] = useState(data.height || '');
  const [drinks, setDrinks] = useState(data.drinkFreq || []);
  const [smokes, setSmokes] = useState(data.smokeFreq || []);
  const [workouts, setWorkouts] = useState(data.workoutOptions || []);
  const [locations, setLocations] = useState(data.locations || []);
  const [professions, setProfessions] = useState(data.professions || []);
  const [languages, setLanguages] = useState(data.languages || []);
  const [describeSelf, setDescribeSelf] = useState(data.describeSelf || '');
  const [idealDate, setIdealDate] = useState(data.idealDate || '');
  const [greatPartner, setGreatPartner] = useState(data.greatPartner || '');
  const [likes, setLikes] = useState(data.likes || []);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        firstName,
        gender: [gender],
        interestedIn: [interest],
        lookingFor,
        age,
        height,
        drinkFreq: drinks,
        smokeFreq: smokes,
        workoutOptions: workouts,
        locations,
        professions,
        languages,
        describeSelf,
        idealDate,
        greatPartner,
        likes,
      };

      const userId = data?.user_id;
      const token = getCookie('accessToken');

      const response = await fetch(`${api_url}/api/dating-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      setTimeout(() => {
        window.location.reload(); // reload the page
      }, 500);
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-y-scroll">
      <h2 className="text-xl font-extrabold mb-6">Dating Profile</h2>
      <div className="space-y-4 border-t-1 p-3">
        <FirstNameForm value={firstName} onChange={setFirstName} />
        <GenderStep value={gender} onChange={setGender} />
        <InterestStep value={interest} onChange={setInterest} />
        <LookingForStep value={lookingFor} onChange={setLookingFor} />
        <hr />
        <BasicsForm
          age={age}
          setAge={setAge}
          height={height}
          setHeight={setHeight}
          drinks={drinks}
          setDrinks={setDrinks}
          smokes={smokes}
          setSmokes={setSmokes}
        />
        <hr />
        <BasicsStepTwo
          workoutOptions={workouts}
          setWorkoutOptions={setWorkouts}
          locations={locations}
          setLocations={setLocations}
          professions={professions}
          setProfessions={setProfessions}
        />
        <hr />
        <BasicsStepThree
          languages={languages}
          setLanguages={setLanguages}
          describeSelf={describeSelf}
          setDescribeSelf={setDescribeSelf}
          idealDate={idealDate}
          setIdealDate={setIdealDate}
          greatPartner={greatPartner}
          setGreatPartner={setGreatPartner}
        />
        <hr />
        <LikesForm likes={likes} setLikes={setLikes} />

        {/* ✅ Add Save Button */}
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-6 py-2 rounded-lg transition ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800 text-white'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
