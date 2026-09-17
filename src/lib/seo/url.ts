import { publicConfig } from "@/config/config";

/** Convierte una ruta relativa en URL absoluta del sitio (sitemap, robots, JSON-LD). */
export function absoluteUrl(pathname = "/"): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${publicConfig.siteUrl}${path === "/" ? "" : path}`;
}
