import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

/** Next.js 16 `proxy`: negociación de idioma y redirección al prefijo `/[locale]`. */
export default createMiddleware(routing);

export const config = {
  // Excluye API, internos de Next/Vercel y archivos con extensión (sitemap.xml, robots.txt…).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
