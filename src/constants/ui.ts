/** Breakpoints de Tailwind en px (mantener sincronizados con el tema). */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/** Id del `<main>` usado por el enlace "saltar al contenido". */
export const MAIN_CONTENT_ID = "main-content";

/** Colores del navegador (viewport/manifest). Placeholders neutrales. */
export const THEME_COLORS = {
  light: "#ffffff",
  dark: "#0a0a0a",
} as const;
