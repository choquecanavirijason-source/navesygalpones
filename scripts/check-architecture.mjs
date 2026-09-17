#!/usr/bin/env node
/**
 * Verifica las reglas de dependencia entre capas (ver CLAUDE.md).
 * Sin dependencias externas. Uso: `npm run check:arch`
 *
 * Resuelve imports con alias `@/` y relativos, y aplica cada regla sobre la
 * ruta de destino normalizada (`src/...`). Sale con código 1 si hay violaciones.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const EXTENSIONS = new Set([".ts", ".tsx", ".mts", ".js", ".mjs"]);

// ─── Utilidades ────────────────────────────────────────────────────────────

const toPosix = (value) => value.split(path.sep).join("/");

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return EXTENSIONS.has(path.extname(entry)) && !entry.endsWith(".d.ts") ? [full] : [];
  });
}

const IMPORT_PATTERNS = [
  /(?:^|[\s;])(?:import|export)\s[^'"`;]*?\sfrom\s*['"]([^'"]+)['"]/g,
  /(?:^|[\s;])import\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];

function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

function extractImports(code) {
  const clean = stripComments(code);
  const specifiers = new Set();
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of clean.matchAll(pattern)) specifiers.add(match[1]);
  }
  return [...specifiers];
}

/** Devuelve `src/...` para imports internos o `null` para paquetes externos. */
function resolveInternal(fromFile, specifier) {
  if (specifier.startsWith("@/")) return `src/${specifier.slice(2)}`;
  if (specifier.startsWith(".")) {
    return toPosix(path.relative(ROOT, path.resolve(path.dirname(fromFile), specifier)));
  }
  return null;
}

/** `target` está dentro de `prefix` (carpeta o archivo sin extensión). */
const within = (target, prefix) =>
  target === prefix || target.startsWith(`${prefix}/`) || target.startsWith(`${prefix}.`);

const withinAny = (target, prefixes) => prefixes.some((prefix) => within(target, prefix));

const packageName = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

// ─── Reglas ────────────────────────────────────────────────────────────────

const LAYERS = {
  app: "src/app",
  appApi: "src/app/api",
  core: "src/core",
  infrastructure: "src/infrastructure",
  application: "src/application",
  presentation: "src/presentation",
  components: "src/components",
  lib: "src/lib",
  config: "src/config",
  constants: "src/constants",
  content: "src/content",
  i18n: "src/i18n",
  messages: "src/messages",
};

const API_CLIENT = "src/infrastructure/http/clients/apiClient";
const UI_PACKAGES = ["react", "react-dom", "next", "next-intl", "swr", "motion", "lucide-react", "radix-ui"];

/**
 * Cada regla: `files` decide a qué archivos aplica; `internal` / `external`
 * devuelven un mensaje si el import está prohibido.
 */
const RULES = [
  {
    name: "core-is-pure",
    files: (file) => within(file, LAYERS.core),
    internal: (target) =>
      !within(target, LAYERS.core) && "core solo puede importar de core (tipos, interfaces, modelos).",
    external: () => "core no puede depender de paquetes externos.",
  },
  {
    name: "application-depends-on-contracts",
    files: (file) => within(file, LAYERS.application),
    internal: (target) =>
      withinAny(target, [
        LAYERS.infrastructure,
        LAYERS.presentation,
        LAYERS.components,
        LAYERS.app,
        LAYERS.lib,
        LAYERS.i18n,
      ]) && "application depende de interfaces de core; la implementación se inyecta por constructor.",
    external: (pkg) =>
      [...UI_PACKAGES, "axios"].includes(pkg) &&
      `application no puede importar "${pkg}" (framework/transporte).`,
  },
  {
    name: "infrastructure-boundaries",
    files: (file) => within(file, LAYERS.infrastructure),
    internal: (target) => {
      if (withinAny(target, [LAYERS.presentation, LAYERS.components, LAYERS.app, LAYERS.lib, LAYERS.i18n])) {
        return "infrastructure no puede importar UI, rutas ni lib.";
      }
      if (within(target, LAYERS.application) && !within(target, "src/application/errors")) {
        return "infrastructure solo puede usar application/errors (nunca servicios).";
      }
      return false;
    },
    external: (pkg) =>
      UI_PACKAGES.includes(pkg) && `infrastructure no puede importar "${pkg}".`,
  },
  {
    name: "presentation-no-data-access",
    files: (file) => withinAny(file, [LAYERS.presentation, LAYERS.components]),
    internal: (target) => {
      if (within(target, API_CLIENT)) return "La UI nunca importa apiClient (solo app/api).";
      if (within(target, "src/infrastructure/repositories")) return "La UI nunca importa repositorios.";
      if (within(target, "src/infrastructure/http/base")) return "La UI usa servicios + apiLocal, no HttpClient.";
      if (within(target, "src/infrastructure/mailer")) return "El mailer es solo de servidor.";
      if (within(target, "src/application/services/modules")) {
        return "La UI usa servicios de application/services/client, no los de servidor.";
      }
      if (within(target, LAYERS.app)) return "La UI no importa desde app/.";
      return false;
    },
    external: (pkg) => pkg === "axios" && "La UI no importa axios: usa hooks → servicios → apiLocal.",
  },
  {
    name: "api-client-only-in-api-routes",
    files: (file) => !within(file, LAYERS.appApi) && !within(file, API_CLIENT),
    internal: (target) =>
      within(target, API_CLIENT) && "apiClient solo se importa desde src/app/api/** (composition root).",
  },
  {
    name: "components-below-presentation",
    files: (file) => within(file, LAYERS.components),
    internal: (target) =>
      withinAny(target, [LAYERS.presentation, LAYERS.application, LAYERS.infrastructure]) &&
      "components/ (shadcn, loaders, toast) es la base: no conoce presentation, application ni infrastructure.",
  },
  {
    name: "app-pages-are-thin",
    files: (file) => within(file, LAYERS.app) && !within(file, LAYERS.appApi),
    internal: (target) =>
      withinAny(target, [LAYERS.infrastructure, "src/application/services", LAYERS.components]) &&
      "Las rutas de app/[locale] solo envuelven páginas de presentation/pages.",
    external: (pkg) => ["axios", "swr"].includes(pkg) && `app/[locale] no usa "${pkg}".`,
  },
  {
    name: "lib-is-shared",
    files: (file) => within(file, LAYERS.lib),
    internal: (target) =>
      withinAny(target, [LAYERS.presentation, LAYERS.app, LAYERS.application, LAYERS.infrastructure]) &&
      "lib/ contiene utilidades transversales sin dependencias de capas superiores.",
  },
  {
    name: "config-is-leaf",
    files: (file) => withinAny(file, [LAYERS.config, LAYERS.constants, LAYERS.content]),
    internal: (target) =>
      withinAny(target, [
        LAYERS.presentation,
        LAYERS.app,
        LAYERS.application,
        LAYERS.infrastructure,
        LAYERS.components,
        LAYERS.lib,
      ]) && "config/constants/content solo pueden depender de core, config, constants o messages.",
  },
  {
    name: "atomic-hierarchy",
    files: (file) => within(file, LAYERS.presentation),
    internal: (target, file) => {
      const levels = ["atoms", "molecules", "organisms", "templates", "pages"];
      const levelOf = (p) => levels.findIndex((level) => within(p, `src/presentation/${level}`));
      const from = levelOf(file);
      const to = levelOf(target);
      if (from === -1 || to === -1) return false;
      if (to > from) return `Un ${levels[from].slice(0, -1)} no puede importar ${levels[to]}.`;
      return false;
    },
  },
  {
    name: "atoms-molecules-without-data",
    files: (file) =>
      withinAny(file, ["src/presentation/atoms", "src/presentation/molecules"]),
    internal: (target) =>
      within(target, "src/presentation/hooks/modules") &&
      "Atoms y molecules reciben datos por props; los hooks de datos se usan desde organisms.",
  },
  {
    name: "motion-lazy-only",
    files: () => true,
    external: (pkg, specifier, code) => {
      if (pkg === "framer-motion") return 'Importar desde "motion/react", no "framer-motion".';
      if (specifier === "motion/react" && /import\s*\{[^}]*\bmotion\b[^}]*\}\s*from\s*['"]motion\/react['"]/.test(code)) {
        return "Usar componentes `m.*` (LazyMotion strict), nunca `motion.*`.";
      }
      return false;
    },
  },
];

// ─── Ejecución ─────────────────────────────────────────────────────────────

const violations = [];
const files = walk(SRC);

for (const absolute of files) {
  const file = toPosix(path.relative(ROOT, absolute)).replace(/\.[^/.]+$/, "");
  const code = readFileSync(absolute, "utf8");

  for (const specifier of extractImports(code)) {
    const target = resolveInternal(absolute, specifier);

    for (const rule of RULES) {
      if (!rule.files(file)) continue;

      const message = target
        ? rule.internal?.(target, file)
        : rule.external?.(packageName(specifier), specifier, code);

      if (message) {
        violations.push({ rule: rule.name, file: toPosix(path.relative(ROOT, absolute)), specifier, message });
      }
    }
  }
}

if (violations.length === 0) {
  console.log(`✔ Arquitectura OK — ${files.length} archivos, ${RULES.length} reglas.`);
  process.exit(0);
}

console.error(`✖ ${violations.length} violación(es) de arquitectura:\n`);
for (const v of violations) {
  console.error(`  [${v.rule}] ${v.file}\n    import "${v.specifier}"\n    → ${v.message}\n`);
}
process.exit(1);
