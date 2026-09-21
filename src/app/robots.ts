import type { MetadataRoute } from "next";

import { publicConfig } from "@/config/config";
import { absoluteUrl } from "@/lib/seo/url";

/*
 * Prerenderizado en build: lo exige `output: export`, donde no hay servidor que
 * evalúe la ruta en cada request. En el build normal ya era estática, así que no cambia nada.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: publicConfig.siteUrl,
  };
}
