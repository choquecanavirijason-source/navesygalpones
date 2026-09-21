#!/usr/bin/env node
/**
 * Genera el sitio estático en `out/` (`output: "export"`), listo para cualquier servidor
 * de archivos. Sin dependencias externas. Uso: `npm run build:static`
 *
 * Además del `next build`, escribe `out/index.html`: en el export no corre `src/proxy.ts`,
 * así que la negociación de idioma de `/` se resuelve en el navegador.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");
const ROUTING_FILE = path.join(ROOT, "src", "i18n", "routing.ts");

/* Se leen del routing en vez de duplicarlos: un idioma nuevo no debe exigir tocar este script. */
const routingSource = readFileSync(ROUTING_FILE, "utf8");
const defaultLocale = routingSource.match(/defaultLocale:\s*["'](\w+)["']/)?.[1];
const locales = [...(routingSource.match(/locales:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/["'](\w+)["']/g)].map(
  (match) => match[1],
);

if (!defaultLocale || locales.length === 0) {
  console.error("✖ No se pudieron leer locales/defaultLocale de src/i18n/routing.ts");
  process.exit(1);
}

/*
 * Se invoca el binario de Next con el Node actual en vez de `npx` con shell: evita depender
 * del `.cmd` de Windows y del escapado de argumentos del intérprete.
 */
const build = spawnSync(process.execPath, [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build"], {
  cwd: ROOT,
  stdio: "inherit",
  env: { ...process.env, NEXT_STATIC_EXPORT: "1" },
});

if (build.status !== 0) process.exit(build.status ?? 1);

if (!existsSync(OUT_DIR)) {
  console.error("✖ El build terminó sin generar `out/`.");
  process.exit(1);
}

/*
 * Redirección de `/` al idioma del navegador. Se replica lo que hace el proxy en el build
 * normal: primer idioma soportado que coincida con `navigator.languages`, o el por defecto.
 * El `<meta http-equiv="refresh">` cubre el caso sin JavaScript, y el `noindex` evita que
 * este trampolín compita en buscadores con las home reales.
 */
const redirectHtml = `<!doctype html>
<html lang="${defaultLocale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=/${defaultLocale}/" />
    <link rel="canonical" href="/${defaultLocale}/" />
${locales.map((locale) => `    <link rel="alternate" hreflang="${locale}" href="/${locale}/" />`).join("\n")}
    <title>NyG</title>
  </head>
  <body>
    <script>
      (function () {
        var locales = ${JSON.stringify(locales)};
        var fallback = ${JSON.stringify(defaultLocale)};
        var preferred = navigator.languages || [navigator.language || fallback];
        var match = fallback;
        for (var i = 0; i < preferred.length; i++) {
          var base = String(preferred[i]).toLowerCase().split("-")[0];
          if (locales.indexOf(base) !== -1) {
            match = base;
            break;
          }
        }
        location.replace("/" + match + "/");
      })();
    </script>
    <noscript><a href="/${defaultLocale}/">Continuar</a></noscript>
  </body>
</html>
`;

writeFileSync(path.join(OUT_DIR, "index.html"), redirectHtml);

console.log(`\n✔ Export estático en out/ — idiomas: ${locales.join(", ")} (por defecto: ${defaultLocale}).`);
console.log("  out/index.html redirige `/` al idioma del navegador (el proxy no corre en el export).");
