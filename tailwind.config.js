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
        accent: "#f39c12",
        foreground: "#ffffff",
        "on-accent": "#ffffff",
        surface: "#202020",
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
        input: {
          backgroundColor: theme("colors.surface"),
          borderColor: theme("colors.gray.500"),
          borderWidth: theme("borderWidth.2"),
          color: theme("colors.foreground"),
          iconColor: theme("colors.foreground"),
          "&:hover": {
            borderColor: theme("colors.accent"),
          },
          "&:focus": {
            backgroundColor: theme("colors.surface"),
            borderColor: theme("colors.accent"),
          },
        },
        select: {
          backgroundColor: theme("colors.surface"),
          borderColor: theme("colors.gray.500"),
          borderWidth: theme("borderWidth.2"),
          color: theme("colors.foreground"),
          iconColor: theme("colors.foreground"),
          "&:hover": {
            borderColor: theme("colors.accent"),
          },
          "&:focus": {
            backgroundColor: theme("colors.surface"),
            borderColor: theme("colors.accent"),
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
