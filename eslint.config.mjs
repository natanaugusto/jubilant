import js from "@eslint/js"
import globals from "globals"
import vue from "eslint-plugin-vue"
import prettier from "eslint-plugin-prettier"
import markdown from "@eslint/markdown"
import css from "@eslint/css"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js, vue, prettier },
    extends: ["js/recommended"],
    rules: {
      "prettier/prettier": "error",
      quotes: ["error", "double"],
      semi: ["error", "never"]
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, API_URL: "readonly" }
    }
  },
  vue.configs["flat/essential"],
  {
    files: ["**/*.md"],
    plugins: { markdown, prettier },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },
  {
    files: ["**/*.css"],
    plugins: { css, prettier },
    language: "css/css",
    extends: ["css/recommended"]
  }
])
