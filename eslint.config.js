// ESLint flat config (ESLint 9). Cubre src/**/*.{ts,js}.
// Incluimos una regla que prohíbe asignaciones a `innerHTML`/`outerHTML`:
// en el demo, esta regla ayuda a que el SAST/lint marque el XSS DOM de la rama vuln.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "**/*.config.*"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,js}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        location: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
        HTMLElement: "readonly",
      },
    },
    rules: {
      // Defensa en profundidad contra XSS DOM-based: nunca asignar HTML sin sanitizar.
      "no-restricted-properties": [
        "error",
        {
          object: undefined,
          property: "innerHTML",
          message:
            "No asignes innerHTML con datos del usuario (XSS / OWASP A03). Usa textContent.",
        },
        {
          object: undefined,
          property: "outerHTML",
          message:
            "No asignes outerHTML con datos del usuario (XSS / OWASP A03). Usa textContent.",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
