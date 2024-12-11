/** @type {import('tailwindcss').Config} */
import themes from "./src/theme.json";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [themes],
  },
  theme: {
    extend: {
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle, var(--tw-gradient-stops))",
      },
    },
  },

  plugins: [require("daisyui")],
};
