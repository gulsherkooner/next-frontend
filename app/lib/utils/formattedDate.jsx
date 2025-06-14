import React from 'react'

const formattedDate = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date)) return "";

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Get ordinal suffix
  const getSuffix = (n) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${day}${getSuffix(day)} ${month} ${year}`;
}

export default formattedDate