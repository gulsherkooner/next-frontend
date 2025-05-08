/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // Include this if using the app directory
  ],
  theme: {
    extend: {
      colors: {
        "custom-background": "#FFFFFF",
        "custom-surface": "#F3F3F3",
        "custom-primary-text": "#121212",
        "custom-secondary-text": "#5A5A5A",
        "custom-brand-color": "#E90E0E",
        "custom-secondary-action": "#F0F4FF",
        "custom-border-dividers": "#E0E0E0",
        "custom-error": "#EB5757",
        "custom-success": "#27AE60",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        /* Hide scrollbar for Chrome, Safari and Opera */
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
      };
      addUtilities(newUtilities);
    },
    nextui(),
  ],
};
