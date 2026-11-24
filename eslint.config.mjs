import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    // Third-party agent skills (taste-skill) and their working folder: not our code.
    ".agents/**",
    ".claude/skills/**",
    ".taste-skill/**",
    // The dealt moment's loader, copied from the skill's kit unchanged (served as plain files).
    "public/assets/**",
  ]),
  {
    // Legacy relaxations carried over unchanged from the previous config.
    // They are removed in the foundation step as each area is rewritten.
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react-hooks/exhaustive-deps": "off",
      // React Compiler rules introduced by eslint-config-next 16. Legacy code
      // violates them (setState in effects, Math.random in render); they are
      // warnings until the affected areas are rewritten, then become errors.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
    },
  },
]);
