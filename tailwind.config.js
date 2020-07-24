module.exports = {
  purge: ["./index.html", "./src/**/*.vue"],
  theme: {
    extend: {},
  },
  variants: {
    opacity: ["responsive", "hover", "focus", "disabled"],
    cursor: ["responsive", "disabled"],
    fill: ["responsive", "hover", "focus"],
    borderWidth: ["responsive", "last", "hover", "focus"],
  },
  plugins: [require("@tailwindcss/custom-forms")],
};
