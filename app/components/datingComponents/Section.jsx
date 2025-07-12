import React from "react";

const Section = ({ title, text }) => {
  return (
    <div>
      <h2 className="text-md font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-700 whitespace-pre-line bg-gray-200 p-4 rounded-xl shadow-sm mb-5">
        {text}
      </p>
    </div>
  );
};

export default Section;