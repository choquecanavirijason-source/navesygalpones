import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en", "pt"],
  defaultLocale: "es",
  localePrefix: "always",
  /*
   * Sin negociación con el navegador: entrar sin prefijo siempre lleva a español.
   *
   * next-intl resuelve el idioma en este orden: prefijo de la URL → cookie `NEXT_LOCALE` →
   * cabecera `accept-language` → idioma por defecto. Con la detección activada, un visitante
   * con el navegador en inglés caía en `/en` y nunca se usaba el idioma por defecto.
   *
   * Las URLs con prefijo siguen mandando (`/en`, `/pt`), así que el selector de idioma
   * funciona igual; lo que cambia es a dónde va quien entra a la raíz.
   */
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

/** Normaliza el parámetro `[locale]` de la URL a un idioma soportado. */
export function resolveLocale(candidate: string): AppLocale {
  return hasLocale(routing.locales, candidate) ? candidate : routing.defaultLocale;
}
