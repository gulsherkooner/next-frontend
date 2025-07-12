import React from "react";

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

const EditableTags = ({ title, items = [] }) => {
  return (
    <div className="max-w-xs bg-gray-200 p-4 rounded-xl shadow-sm mb-5">
      <h3 className="font-semibold mb-2 text-sm text-gray-800">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="bg-gray-100 px-3 py-1 text-xs rounded-full border text-gray-700"
          >
            {tagEmojis[item] ? `${tagEmojis[item]} ` : ""}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EditableTags;