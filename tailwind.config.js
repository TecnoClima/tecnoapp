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
      colors: {
        inspection: "#ffc933",
        maintenance: "#ea821f",
        emergency: "#f42510",
        mounting: "#14bbee",
        preventive: "#11af16",
        reclaim: "#FFFFFF",
        workshop: "#81cacd",
      },
    },
  },

  plugins: [require("daisyui")],
};
