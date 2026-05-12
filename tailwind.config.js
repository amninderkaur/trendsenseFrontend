/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#c1d1bf",        // main sage background
          bgDark: "#a3bea9",    // darker dashboard section
          card: "#F4F2ED",      // cream form/card
          input: "#dae4e2",     // pale blue input boxes
          blue: "#b9d6da",      // soft blue circles/search/nav
          blueDark: "#96b7bc",
          text: "#000000",      // dark text
          muted: "#4B5563",     // smaller gray text
          accent: "#FF6B4A",    // coral/orange icons
          white: "#FFFFFF",
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
