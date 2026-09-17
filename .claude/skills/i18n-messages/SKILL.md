---
name: i18n-messages
description: Gestionar la internacionalización de esta landing con next-intl 4 (es por defecto, en, pt). Cubre la estructura de namespaces en src/messages, las claves tipadas con es.json como fuente, useTranslations en Server y Client Components, getTranslations en funciones async y metadata, argumentos ICU (plurales, fechas, números), texto enriquecido, navegación localizada con @/i18n/navigation, cómo agregar un idioma nuevo y la validación de paridad con npm run check:i18n. Úsalo cuando pidan traducir, agregar o cambiar textos, crear claves, agregar un idioma, cambiar el idioma por defecto o el prefijo de URL, o trabajes en src/messages, src/i18n o src/proxy.ts. Requiere landing-architecture. Slash: /i18n-messages
---

# Internacionalización (next-intl)

## Piezas

| Archivo | Rol |
|---|---|
| `src/i18n/routing.ts` | `locales: ["es", "en", "pt"]`, `defaultLocale: "es"`, `localePrefix: "always"`, `resolveLocale()` |
| `src/i18n/request.ts` | Carga `src/messages/<locale>.json` por petición |
| `src/i18n/navigation.ts` | `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` localizados |
| `src/proxy.ts` | Redirige `/` → `/es`, negocia idioma, excluye `api`, `_next` y archivos con extensión |
| `src/types/next-intl.d.ts` | Tipa `Locale` y `Messages` desde `routing` y **`es.json`** |
| `scripts/check-messages.mjs` | Paridad de claves y argumentos ICU entre idiomas |

## Namespaces

```jsonc
{
  "Metadata":   { "siteName": "…", "<pagina>": { "title": "…", "description": "…" } },
  "Navigation": { "<ruta>": "…", "mainNavLabel": "…", "skipToContent": "…", "…": "…" },
  "Footer":     { "copyright": "© {year} {siteName}" },
  "Home":       { "hero": { "badge": "…", "title": "…", "description": "…", "primaryAction": "…" } },
  "<Pagina>":   { "<seccion>": { … } },
  "NotFound":   { … },
  "Common":     { "loading": "…", "retry": "…", "close": "…" },   // UI transversal
  "Errors":     { "<ERROR_CODE>": "…" }                            // 1:1 con application/errors/errorCodes.ts
}
```

Convenciones:

- Namespace de primer nivel en **PascalCase** = página o dominio de UI. Segundo nivel = sección (`Home.hero`).
- Claves en **camelCase** que describen la función, no el texto (`primaryAction`, no `learnMore`).
- `Errors` usa exactamente los códigos de `ERROR_CODES` (`VALIDATION_ERROR`…).
- Solo texto visible o accesible. Rutas, ids y clases no van en mensajes.
- En esta etapa: **placeholders genéricos** ("Título", "Descripción."). No inventar copy comercial.

## Agregar o cambiar textos

1. Editar **los tres** archivos (`es`, `en`, `pt`) con la misma estructura.
2. `es.json` define los tipos: una clave inexistente ahí da error de TypeScript en `t("…")`.
3. `npm run check:i18n` detecta claves faltantes o sobrantes, argumentos ICU distintos y valores vacíos.

Eliminar claves que ya no se usan (buscar la clave antes de borrarla).

## Uso en componentes

```tsx
// Server Component (no async) o Client Component
import { useTranslations } from "next-intl";
const t = useTranslations("Home.hero");
t("title");
```

```ts
// Funciones async: generateMetadata, manifest, route handlers, Server Components async
import { getTranslations } from "next-intl/server";
const t = await getTranslations({ locale, namespace: "Metadata.home" });
```

- Traducir en **páginas** u **organismos**, y pasar strings a molecules y atoms (ver `/atomic-component`).
- Claves dinámicas tipadas: la unión debe ser subconjunto del namespace. Por ejemplo, `labelKey: keyof Messages["Navigation"]` en `content/navigation.ts`, o `error.code` con `useTranslations("Errors")`.
- En `app/[locale]/**/page.tsx`, llamar a `setRequestLocale(resolveLocale(locale))` antes de renderizar (render estático).
- `NextIntlClientProvider` ya está en el layout y hereda mensajes y locale. No pasar `messages` a mano.

## ICU: argumentos y formato

```jsonc
"copyright": "© {year} {siteName}",
"items": "{count, plural, =0 {Sin elementos} one {# elemento} other {# elementos}}",
"updated": "Actualizado el {date, date, long}",
"price": "{amount, number, ::currency/USD}"
```

```tsx
t("copyright", { year: String(new Date().getFullYear()), siteName });   // year como string: evita "2.026"
t("items", { count: 3 });
t("updated", { date: new Date(iso) });
```

- Un número pasado a un argumento simple `{x}` se formatea con separador de miles según el idioma. Pasar `String(x)` si es un identificador o un año.
- Los nombres de argumento deben ser idénticos en los tres idiomas (lo valida `check:i18n`).

Texto enriquecido:

```jsonc
"legal": "Acepto los <terms>términos</terms>."
```

```tsx
t.rich("legal", { terms: (chunks) => <Link href={ROUTES.terms}>{chunks}</Link> });
```

## Navegación localizada

```tsx
import { Link, redirect, usePathname, useRouter, getPathname } from "@/i18n/navigation";

<Link href={ROUTES.privacy}>…</Link>                    // → /<locale-actual>/company/privacy
router.replace(pathname, { locale: "en" });              // cambiar idioma conservando la ruta
getPathname({ locale: "pt", href: ROUTES.forex });       // → /pt/markets/forex (SEO, sitemap)
```

Nunca `next/link`, ni `useRouter` o `redirect` de `next/navigation` (solo `notFound`). `usePathname` devuelve la ruta **sin** prefijo de idioma.

## Agregar un idioma (ej.: `fr`)

1. `src/i18n/routing.ts`: agregar `"fr"` a `locales`.
2. Crear `src/messages/fr.json` copiando la estructura completa de `es.json`.
3. `npm run check:i18n` debe pasar.
4. Nada más: `LocaleSwitcher`, `generateStaticParams`, `hreflang` y el sitemap iteran `routing.locales`.
5. `npm run build`: cada página debe generarse también en `/fr/...`.

## Cambiar la estrategia de URL

- `localePrefix: "as-needed"` quita el prefijo del idioma por defecto (`/` en vez de `/es`). Revisar `manifest.ts` (`start_url`) y probar `sitemap.xml` y los `canonical`: `getPathname` ya respeta la estrategia.
- Cambiar `defaultLocale` también cambia la fuente de tipos recomendada: actualizar el import en `src/types/next-intl.d.ts` y la base de `check:i18n` (la lee de `routing.ts`).

## Checklist

- [ ] Claves en `es`, `en` y `pt`, con la misma estructura y los mismos argumentos.
- [ ] Sin texto hardcodeado en componentes; atoms y molecules reciben strings.
- [ ] Enlaces y redirecciones desde `@/i18n/navigation`.
- [ ] `npm run check:i18n` y `npm run typecheck` pasan.
