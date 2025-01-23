import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import * as tsParser from "@typescript-eslint/parser"
import solid from "eslint-plugin-solid/configs/typescript";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { 
    globals: globals.browser,
    parser: tsParser,
    parserOptions: {
      project: "tsconfig.json"
    }
  }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  solid,
  {
    rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]}
  },
];