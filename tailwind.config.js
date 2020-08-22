const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./index.html", "./src/**/*.vue"],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  experimental: {
    applyComplexClasses: true,
    shadowLookup: true,
  },
  theme: {
    extend: {
      colors: {
        ...colors,
        gray: {
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#939393",
          600: "#676767",
          700: "#444444",
          800: "#343434",
          900: "#171717",
        },
      },
    },
    customForms: (theme) => ({
      default: {
        "select, input": {
          backgroundColor: theme("colors.gray.400"),
          borderColor: theme("colors.gray.500"),
          borderWidth: theme("borderWidth.2"),
          color: theme("colors.gray.800"),
          iconColor: theme("colors.gray.800"),
          "&:focus": {
            backgroundColor: theme("colors.gray.200"),
            borderColor: theme("colors.blue.400"),
          },
        },
        checkbox: {
          width: theme("spacing.6"),
          height: theme("spacing.6"),
        },
      },
    }),
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
