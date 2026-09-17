import type { MetadataRoute } from "next";

import { publicConfig } from "@/config/config";
import { absoluteUrl } from "@/lib/seo/url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: publicConfig.siteUrl,
  };
}
