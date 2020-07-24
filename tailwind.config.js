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
    backgroundColor: ["responsive", "hover", "focus", "odd"],
  },
  plugins: [require("@tailwindcss/custom-forms")],
};
