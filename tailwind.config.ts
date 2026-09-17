import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 se configura principalmente desde CSS (`@theme` en
 * `src/styles/globals.css`). Este archivo se carga con la directiva `@config`
 * y queda reservado para lo que aún no puede expresarse en CSS
 * (plugins JS, safelist, etc.). Los tokens de diseño NO van aquí.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
