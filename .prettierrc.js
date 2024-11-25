module.exports = {
  // parser: "flow",
  // "prettier/prettier": "error",
  // trailingComma: "none",
  // arrowBodyStyle: "off",
  // preferArrowCallback: "off"
  overrides: [
    {
      files: ["*.ts"],
      options: {
        // parser: "flow"
        parser: "typescript",
      },
    },
    {
      files: [
        "*.tsx",
        "types.ts",
        // "use*.ts",
        "./styles/css.ts",
        "./hooks/*.ts",
        "./configs/*.ts",
        "./contents/*.ts",
      ],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["*.js"],
      options: {
        parser: "babel",
      },
    },
  ],
};
