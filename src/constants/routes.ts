/** Rutas públicas de la landing, sin prefijo de idioma (lo agrega next-intl). */
export const ROUTES = {
  home: "/",
  quotes: "/cotizaciones",
  proyectos: "/proyectos",
  forex: "/markets/forex",
  privacy: "/company/privacy",
  terms: "/company/terms",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Rutas incluidas en `sitemap.xml`. */
export const SITEMAP_ROUTES = [
  ROUTES.home,
  ROUTES.quotes,
  ROUTES.proyectos,
  ROUTES.forex,
  ROUTES.privacy,
  ROUTES.terms,
] as const satisfies readonly AppRoute[];
