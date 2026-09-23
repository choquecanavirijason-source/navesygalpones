import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

import { THEME_COLORS } from "@/constants/ui";
import { routing } from "@/i18n/routing";

/*
 * Prerenderizado en build: lo exige `output: export`, donde no hay servidor que
 * evalúe la ruta en cada request. En el build normal ya era estática, así que no cambia nada.
 */
export const dynamic = "force-static";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "Metadata" });
  const siteName = t("siteName");

  return {
    name: siteName,
    short_name: siteName,
    start_url: `/${routing.defaultLocale}`,
    display: "standalone",
    background_color: THEME_COLORS.light,
    theme_color: THEME_COLORS.light,
    // El favicon y el de iOS salen por convención de archivo (`app/icon.svg`,
    // `app/apple-icon.png`); estos dos son los que pide el manifest para instalar la app.
    icons: [
      { src: "/favicon/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/favicon/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
