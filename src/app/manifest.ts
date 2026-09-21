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
    // Agregar iconos en `public/favicon/` y declararlos aquí.
    icons: [],
  };
}
