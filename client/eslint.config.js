import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import * as tsParser from "@typescript-eslint/parser"
import solid from "eslint-plugin-solid/configs/typescript";
import pluginQuery from '@tanstack/eslint-plugin-query'

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
  ...pluginQuery.configs['flat/recommended'],
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