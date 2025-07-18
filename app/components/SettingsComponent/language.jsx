import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

const languages = [
  "English", "Spanish", "Mandarin Chinese", "Hindi", "Arabic", "French", "Russian", "Portuguese",
  "Bengali", "Japanese", "German", "Korean", "Turkish", "Vietnamese", "Italian", "Urdu",
  "Persian (Farsi)", "Swahili", "Tamil", "Thai"
];

export const Language = () => {
  const [selectedLang, setSelectedLang] = useState("English");

  return (
    <div className="flex-1  rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-y-scroll">
      <h2 className="text-xl font-extrabold mb-6">Language Preferences</h2>
      <div className="space-y-4 border-t-1 p-3">
        <h2 className="font-bold text-xl">App Language</h2>
        <p className="font-medium text-gray-600 text-lg">
          See buttons, titles, and other texts in your preferred language.
        </p>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="space-y-2 mb-4">
          {languages.map((option) => (
            <label key={option} className="flex items-center space-x-4 mb-4">
              <input
                type="radio"
                name="lang"
                value={option}
                checked={selectedLang === option}
                onChange={() => setSelectedLang(option)}
                className="scale-150 accent-teal-400"
              />
              <span className="font-semibold text-xl">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
