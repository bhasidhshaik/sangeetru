/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}", // If using App Router
    ],
    theme: {
      extend: {
        colors: {
          primary: "#051923",
          secondary: "#ff5733", // Custom color
        },
        fontFamily: {
          tangerine: ["Tangerine", "cursive"],
        },
      },
    },
    plugins: [],
  };
  