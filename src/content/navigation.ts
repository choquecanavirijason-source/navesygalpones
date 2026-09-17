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
