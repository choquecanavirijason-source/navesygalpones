import type { MetadataRoute } from "next";

import { ROUTES, SITEMAP_ROUTES } from "@/constants/routes";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo/url";

/*
 * Prerenderizado en build: lo exige `output: export`, donde no hay servidor que
 * evalúe la ruta en cada request. En el build normal ya era estática, así que no cambia nada.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITEMAP_ROUTES.map((route) => ({
    url: absoluteUrl(getPathname({ locale: routing.defaultLocale, href: route })),
    changeFrequency: "monthly",
    priority: route === ROUTES.home ? 1 : 0.5,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          absoluteUrl(getPathname({ locale, href: route })),
        ]),
      ),
    },
  }));
}
