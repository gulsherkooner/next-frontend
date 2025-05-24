import { ChevronRight, Search } from 'lucide-react';
const languages = [
  "English",
  "Spanish",
  "Mandarin Chinese",
  "Hindi",
  "Arabic",
  "French",
  "Russian",
  "Portuguese",
  "Bengali",
  "Japanese",
  "German",
  "Korean",
  "Turkish",
  "Vietnamese",
  "Italian",
  "Urdu",
  "Persian (Farsi)",
  "Swahili",
  "Tamil",
  "Thai"
];

export const Language = () => {
  return (
    <div className="flex-1 bg-gray-200 rounded-md shadow p-6 text-sm text-gray-800 h-[100vh] overflow-y-scroll">
      <h2 className="text-xl font-extrabold mb-6">Language preferences</h2>
      <div className="space-y-4 border-t-1 p-3">
        <h2 className='font-bold text-xl'>App Language</h2>
        <p className='font-medium text-gray-600 text-lg'>See buttons, titles and other texts in your preffered language. </p>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-white pl-10 pr-4 py-2 rounded-full text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
        <ul className="space-y-3 text-sm font-medium text-gray-700 p-1">
        </ul>
        <div className="space-y-2 mb-4">
          {languages.map((option) => (
            <label key={option} className="flex items-center space-x-4 transform: scale-100">
              <input
                type="radio"
                name="lang"
                className="scale-150 accent-gray-800"
              />
              <span className='font-semibold text-xl'>{option}</span>
            </label>
          ))}
        </div>

      </div>
    </div>
  )
}