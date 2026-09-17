import type { MetadataRoute } from "next";

import { ROUTES, SITEMAP_ROUTES } from "@/constants/routes";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo/url";

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
