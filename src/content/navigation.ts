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

/** Ancla dentro de la home. El submenú de "Servicios" se resuelve más adelante. */
export interface HeaderNavItemConfig {
  href: `#${string}`;
  labelKey: HeaderNavLabelKey;
  hasDropdown?: boolean;
  active?: boolean;
}

/** Nav principal del header (nivel 2), namespace `Header.nav`. */
export const HEADER_NAV = [
  { href: "#inicio", labelKey: "home", hasDropdown: false, active: true },
  { href: "#nosotros", labelKey: "about", hasDropdown: false, active: false },
  { href: "#servicios", labelKey: "services", hasDropdown: true, active: false },
  { href: "#obras", labelKey: "projects", hasDropdown: false, active: false },
  { href: "#sustentabilidad", labelKey: "sustainability", hasDropdown: false, active: false },
  { href: "#faq", labelKey: "faq", hasDropdown: false, active: false },
  { href: "#contacto", labelKey: "contact", hasDropdown: false, active: false },
] as const satisfies readonly HeaderNavItemConfig[];
