/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        surface: "#1E1E1E",
        primary: "#00FF7F",
        "primary-hover": "#32FF96",
        "row-alt": "#252525",
        "row-base": "#2E2E2E",
        danger: "#FF4D4D",
        text: "#E0E0E0",
      },
    },
  },
  plugins: [],
};
