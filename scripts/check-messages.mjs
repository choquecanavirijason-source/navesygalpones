#!/usr/bin/env node
/**
 * Verifica que todos los idiomas de `src/messages` tengan exactamente las
 * mismas claves y los mismos argumentos ICU que el idioma por defecto.
 * Sin dependencias externas. Uso: `npm run check:i18n`
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = path.join(ROOT, "src", "messages");
const ROUTING_FILE = path.join(ROOT, "src", "i18n", "routing.ts");

const routingSource = readFileSync(ROUTING_FILE, "utf8");
const defaultLocale = routingSource.match(/defaultLocale:\s*["'](\w+)["']/)?.[1];
const declaredLocales = [...(routingSource.match(/locales:\s*\[([^\]]*)\]/)?.[1] ?? "").matchAll(/["'](\w+)["']/g)].map(
  (match) => match[1],
);

if (!defaultLocale) {
  console.error("✖ No se pudo leer defaultLocale de src/i18n/routing.ts");
  process.exit(1);
}

/** Aplana `{ a: { b: "x" } }` → `{ "a.b": "x" }`. */
function flatten(object, prefix = "") {
  return Object.entries(object).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") Object.assign(acc, flatten(value, fullKey));
    else acc[fullKey] = value;
    return acc;
  }, {});
}

/** Nombres de argumentos ICU de primer nivel: `{name}`, `{count, plural, ...}`. */
function icuArguments(message) {
  if (typeof message !== "string") return [];
  return [...new Set([...message.matchAll(/\{\s*(\w+)\s*(?:,|\})/g)].map((match) => match[1]))].sort();
}

const load = (locale) =>
  flatten(JSON.parse(readFileSync(path.join(MESSAGES_DIR, `${locale}.json`), "utf8")));

const errors = [];
const files = readdirSync(MESSAGES_DIR).filter((file) => file.endsWith(".json"));
const availableLocales = files.map((file) => path.basename(file, ".json"));

for (const locale of declaredLocales) {
  if (!availableLocales.includes(locale)) errors.push(`Falta src/messages/${locale}.json (declarado en routing.ts)`);
}
for (const locale of availableLocales) {
  if (!declaredLocales.includes(locale)) errors.push(`src/messages/${locale}.json no está declarado en routing.ts`);
}

const base = load(defaultLocale);
const baseKeys = Object.keys(base);

for (const locale of availableLocales.filter((l) => l !== defaultLocale)) {
  const current = load(locale);
  const currentKeys = new Set(Object.keys(current));

  for (const key of baseKeys) {
    if (!currentKeys.has(key)) {
      errors.push(`[${locale}] falta la clave "${key}"`);
      continue;
    }
    const expected = icuArguments(base[key]).join(",");
    const actual = icuArguments(current[key]).join(",");
    if (expected !== actual) {
      errors.push(`[${locale}] "${key}" usa argumentos {${actual}} y ${defaultLocale} usa {${expected}}`);
    }
  }

  for (const key of currentKeys) {
    if (!(key in base)) errors.push(`[${locale}] clave sobrante "${key}" (no existe en ${defaultLocale})`);
  }
}

for (const locale of availableLocales) {
  for (const [key, value] of Object.entries(load(locale))) {
    if (typeof value !== "string" || value.trim() === "") errors.push(`[${locale}] "${key}" está vacío o no es texto`);
  }
}

if (errors.length === 0) {
  console.log(
    `✔ i18n OK — ${availableLocales.length} idiomas, ${baseKeys.length} claves (base: ${defaultLocale}).`,
  );
  process.exit(0);
}

console.error(`✖ ${errors.length} problema(s) de i18n:\n`);
errors.forEach((error) => console.error(`  ${error}`));
process.exit(1);
