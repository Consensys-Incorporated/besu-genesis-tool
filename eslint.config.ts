import js from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import globals from "globals";

export default tseslint.config(
  { ignores: ["build/**", "output/**", "src/templates/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@stylistic": stylistic,
      jsdoc,
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/dot-notation": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/triple-slash-reference": ["error", { path: "always", types: "prefer-import", lib: "always" }],
      "@typescript-eslint/unified-signatures": "error",
      "@stylistic/member-delimiter-style": ["error", {
        multiline: { delimiter: "semi", requireLast: true },
        singleline: { delimiter: "semi", requireLast: false },
      }],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/new-parens": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/max-len": ["error", { code: 240 }],
      "@stylistic/spaced-comment": ["error", "always", { markers: ["/"] }],
      "jsdoc/check-alignment": "error",
      "jsdoc/check-indentation": "error",
      "camelcase": "error",
      "eqeqeq": ["error", "smart"],
      "guard-for-in": "error",
      "id-denylist": ["error", "any", "Number", "number", "String", "string", "Boolean", "boolean", "Undefined", "undefined"],
      "max-classes-per-file": ["error", 1],
      "no-bitwise": "error",
      "no-caller": "error",
      "no-empty": "error",
      "no-eval": "error",
      "no-new-wrappers": "error",
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      "radix": "error",
    },
  },
);
