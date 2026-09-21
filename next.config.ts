import path from "node:path";

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/*
 * Export estático (`npm run build:static`): vuelca el sitio a `out/` sin servidor Node.
 * Se activa por variable de entorno para no alterar el build normal, que sí usa proxy,
 * route handlers y optimización de imágenes.
 */
const isStaticExport = process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto (evita que Turbopack detecte lockfiles/workspaces de carpetas superiores).
  turbopack: {
    root: path.resolve("."),
  },
  /*
   * Las rutas que necesitan servidor viven en archivos `*.node.ts(x)` y solo se registran
   * cuando esa extensión está habilitada. En el export estático se omite y esas rutas
   * directamente no existen: el route handler de `/api/example` (lee el `Request` del POST)
   * y el catch-all `[...notFound]` (no se puede enumerar en build).
   */
  pageExtensions: isStaticExport ? ["tsx", "ts"] : ["node.tsx", "node.ts", "tsx", "ts"],
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    // Sin servidor no hay endpoint que optimice: las imágenes se sirven tal cual están en `public/`.
    unoptimized: isStaticExport,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  ...(isStaticExport
    ? {
        output: "export" as const,
        // `out/es/index.html` en vez de `out/es.html`: cualquier servidor de archivos lo resuelve
        // sin reglas de rewrite.
        trailingSlash: true,
      }
    : {}),
};

export default withNextIntl(nextConfig);
