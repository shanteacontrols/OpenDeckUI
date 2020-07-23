module.exports = {
  extends: [
    "plugin:vue/recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  rules: {
    "no-unused-vars": [
      "error",
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: ".*", args: "after-used", argsIgnorePattern: "^_" },
    ],
    "vue/valid-template-root": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
