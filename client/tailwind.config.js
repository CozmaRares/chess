/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        8: "repeat(8, minmax(0, 1fr))",
      },
      gridTemplateColumns: {
        8: "repeat(8, minmax(0, 1fr))",
      },
      colors: {
        "white-tile": "#ECECD7",
        "black-tile": "#4D6D92",
      },
    },
  },
  plugins: [],
};
