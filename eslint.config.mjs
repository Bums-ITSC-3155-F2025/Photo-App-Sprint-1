import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignore build output and dependencies
  {
    ignores: ["node_modules", "dist", "build"],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect", // Fixes the React version warning
      },
    },
    plugins: {
      react: pluginReact,
    },
    // ✅ Use imported configs directly, not string extends
    rules: {
      ...js.configs.recommended.rules, // JS base rules
      ...pluginReact.configs.flat.recommended.rules, // React recommended rules
    },
  },

  // ✅ Add TypeScript configs if you’re using .ts/.tsx files
  ...tseslint.configs.recommended,
]);
