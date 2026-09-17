---
name: landing-page
description: Agregar o modificar una página localizada de esta landing Next.js 16 con next-intl siguiendo el flujo completo, es decir la constante en ROUTES, las claves Metadata y de contenido en es/en/pt, la página en presentation/pages que compone template y organisms, el envoltorio mínimo en app/[locale] con generateMetadata y setRequestLocale, el sitemap y la navegación. Cubre SEO (canonical, hreflang, Open Graph), rutas anidadas, páginas noindex y la página 404. Úsalo cuando pidan una página nueva, una ruta, una sección de sitio como /company/... o /markets/..., cambiar metadata o SEO de una página, agregar un enlace al menú, o trabajes en src/app/[locale] o src/presentation/pages. Requiere landing-architecture y atomic-component. Slash: /landing-page
---

# Página localizada nueva

Ejemplo: agregar `/markets/indices` (reemplazar nombres por los reales; **contenido con placeholders**).

## Paso 1: registrar la ruta

`src/constants/routes.ts`:

```ts
export const ROUTES = {
  home: "/",
  forex: "/markets/forex",
  indices: "/markets/indices",   // ← nueva
  privacy: "/company/privacy",
  terms: "/company/terms",
} as const;

export const SITEMAP_ROUTES = [ROUTES.home, ROUTES.forex, ROUTES.indices, ROUTES.privacy, ROUTES.terms] as const satisfies readonly AppRoute[];
```

Si no debe indexarse (p. ej. una página de agradecimiento), **no** agregarla a `SITEMAP_ROUTES` y usar `noIndex: true` en el paso 4.

## Paso 2: mensajes en los 3 idiomas

En `src/messages/es.json`, `en.json` y `pt.json`, con **las mismas claves**:

```jsonc
{
  "Metadata": {
    "indices": { "title": "Índices", "description": "Descripción de la página de índices." }
  },
  "Navigation": { "indices": "Índices" },        // solo si va en un menú
  "Indices": {                                    // namespace de contenido = nombre de la página
    "hero": { "badge": "Badge", "title": "Título", "description": "Descripción.", "primaryAction": "Acción principal" }
  }
}
```

`es.json` es la fuente de tipos de next-intl: una clave que falta ahí rompe el typecheck. Verificar la paridad con `npm run check:i18n`. Más detalle: `/i18n-messages`.

## Paso 3: página de presentación

`src/presentation/pages/markets/indices/IndicesPage.tsx`. La carpeta refleja la ruta y el archivo se llama `<Nombre>Page.tsx`.

```tsx
import { useTranslations } from "next-intl";

import { ROUTES } from "@/constants/routes";
import { HeroSection } from "@/presentation/organisms/main/hero/HeroSection";
import { MainLayout } from "@/presentation/templates/main/MainLayout";

export function IndicesPage() {
  const t = useTranslations("Indices.hero");

  return (
    <MainLayout>
      <HeroSection
        id="indices-hero"
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        primaryAction={{ href: ROUTES.home, label: t("primaryAction") }}
      />
    </MainLayout>
  );
}
```

Reglas:

- La página **traduce y compone**: template + organisms. No define estilos de sección ni lógica.
- Si hace falta una sección que no existe, crearla con `/atomic-component` antes de usarla aquí.
- Si la sección consume datos del backend, el organismo usa el hook de la feature (`/api-feature`), no la página.
- Si hay más de un hero en el sitio, pasar `id` único (genera el `aria-labelledby`).

## Paso 4: envoltorio en `app`

`src/app/[locale]/markets/indices/page.tsx`: siempre esta forma, sin JSX adicional.

```tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ROUTES } from "@/constants/routes";
import { resolveLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { IndicesPage } from "@/presentation/pages/markets/indices/IndicesPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: "Metadata.indices" });

  return buildPageMetadata({
    locale,
    pathname: ROUTES.indices,
    title: t("title"),
    description: t("description"),
    // noIndex: true,  ← páginas fuera del sitemap
  });
}

export default async function Page({ params }: PageProps) {
  setRequestLocale(resolveLocale((await params).locale));
  return <IndicesPage />;
}
```

Por qué así:

- `setRequestLocale` permite el render estático (SSG) de cada idioma; sin él la ruta pasa a dinámica.
- `buildPageMetadata` genera `canonical`, `hreflang` (+ `x-default`), Open Graph y Twitter. `metadataBase` y la plantilla `%s | <siteName>` vienen del layout.
- **Excepción, la home**: está en el mismo segmento que el layout, donde Next no aplica `title.template`. Por eso pasa `siteName` a `buildPageMetadata` para componer un título absoluto. Las páginas anidadas **no** lo pasan.
- `params` se tipa como `string` y se normaliza con `resolveLocale`. El layout ya responde 404 a los idiomas inválidos.

## Paso 5: navegación (opcional)

`src/content/navigation.ts`: agregar a `MAIN_NAV` o `LEGAL_NAV`. `labelKey` debe existir en `Navigation`:

```ts
export const MAIN_NAV = [
  { href: ROUTES.home, labelKey: "home" },
  { href: ROUTES.forex, labelKey: "forex" },
  { href: ROUTES.indices, labelKey: "indices" },
] as const satisfies readonly NavItemConfig[];
```

`SiteHeader`, `MobileNav` y `SiteFooter` lo reflejan solos, y el estado activo (`aria-current`) también.

## Paso 6: verificar

```bash
npm run validate
npm run build      # la ruta nueva debe aparecer como ● (SSG) en los 3 idiomas
```

Comprobar en `npm run dev`: `/es/markets/indices`, `/en/...`, `/pt/...`, `<title>`, `<link rel="canonical">`, `hreflang` y la entrada en `/sitemap.xml`.

## Casos especiales

- **Ruta dinámica** (`/markets/[slug]`): agregar `generateStaticParams` que combine `routing.locales` × slugs, llamar a `notFound()` de `next/navigation` si el slug no existe y pasar `slug` a la página de presentación como prop.
- **404**: `app/[locale]/[...notFound]/page.tsx` → `app/[locale]/not-found.tsx` → `presentation/pages/not-found/NotFoundPage.tsx`. Para cambiarla, editar la página u organismo, no los archivos de `app`. Next 16 la dibuja en el cliente (status 404 correcto); ver notas en `CLAUDE.md`.
- **Redirecciones**: `redirect` de `@/i18n/navigation` (conserva el idioma), nunca el de `next/navigation`.
- **Template distinto**: crear un template nuevo en `presentation/templates/` (ver `/atomic-component`); no condicionar `MainLayout` por ruta.

## Checklist

- [ ] `ROUTES` (y `SITEMAP_ROUTES` si es indexable).
- [ ] `Metadata.<pagina>` + namespace de contenido en `es`, `en` y `pt`.
- [ ] `presentation/pages/<ruta>/<Nombre>Page.tsx` compone template + organisms.
- [ ] `app/[locale]/<ruta>/page.tsx` con exactamente `generateMetadata` + `setRequestLocale` + `<NombrePage />`.
- [ ] Navegación actualizada si corresponde.
- [ ] `npm run validate` y `npm run build` pasan; la ruta es ● SSG.
