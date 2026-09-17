import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

/** Normaliza el parámetro `[locale]` de la URL a un idioma soportado. */
export function resolveLocale(candidate: string): AppLocale {
  return hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
}
