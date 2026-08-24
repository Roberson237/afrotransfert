import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import { fileURLToPath } from "node:url";

export default defineConfig([
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: fileURLToPath(new URL(".", import.meta.url)),
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]);
