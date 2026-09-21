import { ROUTES, type AppRoute } from "@/constants/routes";
import type messages from "@/messages/es.json";

export type NavigationLabelKey = keyof (typeof messages)["Navigation"];

/** Configuración estructural de un enlace. El texto se resuelve con i18n (namespace `Navigation`). */
export interface NavItemConfig {
  href: AppRoute;
  labelKey: NavigationLabelKey;
}

export const MAIN_NAV = [
  { href: ROUTES.home, labelKey: "home" },
  { href: ROUTES.forex, labelKey: "forex" },
] as const satisfies readonly NavItemConfig[];

export const LEGAL_NAV = [
  { href: ROUTES.privacy, labelKey: "privacy" },
  { href: ROUTES.terms, labelKey: "terms" },
] as const satisfies readonly NavItemConfig[];

export type HeaderNavLabelKey = keyof (typeof messages)["Header"]["nav"];

/**
 * Entrada del nav del header. Casi todas apuntan a secciones de la home; también admite una
 * `AppRoute` para las páginas propias (p. ej. cotizaciones).
 * El submenú de "Servicios" se resuelve más adelante.
 *
 * Las anclas llevan la ruta delante (`/#servicios`, no `#servicios`): el header se dibuja en
 * todas las páginas, y un ancla suelta no lleva a ningún lado fuera de la home.
 *
 * El estado activo no se declara acá: lo deriva `NavLink` de la ruta actual. Fijarlo a mano
 * era lo que dejaba "Inicio" subrayado en todas las páginas.
 */
export interface HeaderNavItemConfig {
  href: `/#${string}` | AppRoute;
  labelKey: HeaderNavLabelKey;
  hasDropdown?: boolean;
}

/** Nav principal del header (nivel 2), namespace `Header.nav`. */
export const HEADER_NAV = [
  { href: ROUTES.home, labelKey: "home", hasDropdown: false },
  { href: "/#nosotros", labelKey: "about", hasDropdown: false },
  { href: "/#servicios", labelKey: "services", hasDropdown: true },
  { href: "/#obras", labelKey: "projects", hasDropdown: false },
  { href: ROUTES.quotes, labelKey: "quotes", hasDropdown: false },
  { href: "/#sustentabilidad", labelKey: "sustainability", hasDropdown: false },
  { href: "/#faq", labelKey: "faq", hasDropdown: false },
  { href: "/#contacto", labelKey: "contact", hasDropdown: false },
] as const satisfies readonly HeaderNavItemConfig[];
