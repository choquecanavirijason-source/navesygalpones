import type { Metadata } from "next";

import type { AppRoute } from "@/constants/routes";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

interface PageMetadataParams {
  locale: AppLocale;
  pathname: AppRoute;
  title: string;
  description: string;
  noIndex?: boolean;
  /**
   * Solo para páginas del MISMO segmento que el layout (la home): ahí Next no aplica
   * `title.template`, así que el sufijo se compone aquí como título absoluto.
   */
  siteName?: string;
}

/** Rutas localizadas de `pathname` para todos los idiomas (+ `x-default`). */
export function getLanguageAlternates(pathname: AppRoute): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((locale) => [locale, getPathname({ locale, href: pathname })]),
  );
  languages["x-default"] = getPathname({ locale: routing.defaultLocale, href: pathname });

  return languages;
}

/**
 * Metadata estándar de una página: title, description, canonical, hreflang,
 * Open Graph y Twitter. Las URLs relativas se resuelven con `metadataBase` del layout.
 */
export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
  noIndex = false,
  siteName,
}: PageMetadataParams): Metadata {
  const canonical = getPathname({ locale, href: pathname });

  return {
    title: siteName ? { absolute: `${title} | ${siteName}` } : title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      locale,
      url: canonical,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
