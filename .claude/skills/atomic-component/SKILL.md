---
name: atomic-component
description: Crear o refactorizar componentes de UI de esta landing con Atomic Design (atoms, molecules, organisms, templates) en src/presentation, usando Server Components por defecto, shadcn/ui como base, Tailwind v4 con tokens, Motion con LazyMotion y m.*, Lucide y accesibilidad. Incluye cómo clasificar un componente, dónde ubicarlo (common/layout/main/<sección>), plantillas de código por nivel, cuándo usar "use client", el contrato de props con texto ya traducido y cómo agregar componentes shadcn corrigiendo el alias de cn. Úsalo cuando pidan crear una sección, un bloque, un botón, una tarjeta, un header/footer, un hero, animaciones, o trabajes en src/presentation/{atoms,molecules,organisms,templates} o src/components. Requiere landing-architecture. Slash: /atomic-component
---

# Componentes con Atomic Design

## 1. Clasificar

| Nivel | Qué es | Puede importar | Ejemplos existentes |
|---|---|---|---|
| **Atom** | Una unidad visual indivisible, sin conocimiento de datos | `components/ui`, `lib`, `helpers`, otros atoms, `@/i18n/navigation` | `Heading`, `Text`, `Reveal`, `Container`, `Logo`, `NavLink`, `HeroTitle` |
| **Molecule** | 2–4 atoms con una sola responsabilidad | atoms, `components/ui` | `HeroHeader`, `HeroActions`, `PageHeader`, `NavList`, `LocaleSwitcher`, `MobileNav` |
| **Organism** | Una sección completa y autónoma de la página | molecules, atoms, `hooks/modules`, `content`, `useTranslations` | `HeroSection`, `SiteHeader`, `SiteFooter`, `LegalDocument`, `NotFoundSection` |
| **Template** | Esqueleto de página; decide la disposición, no el contenido | organisms, `components` | `MainLayout`, `AppLayout` |
| **Page** | Une template + organisms con contenido traducido | todo lo anterior | `HomePage`, `PrivacyPage` |

Si dudas entre dos niveles, elige el **más bajo** cuyo import-set alcance. Un nivel **nunca** importa uno superior (lo verifica `npm run check:arch`).

## 2. Ubicar

```text
src/presentation/<nivel>/
├── common/            reutilizable en cualquier página (Heading, PageHeader, LegalDocument)
├── layout/            estructura global (Container, NavList, SiteHeader, SiteFooter)
└── main/<sección>/    propio de una sección (main/hero/HeroTitle, main/hero/HeroSection)
```

Una sección nueva `features` crea en paralelo `atoms/main/features/`, `molecules/main/features/` y `organisms/main/features/FeaturesSection.tsx`, solo con los niveles que necesite.

Nombres: `PascalCase.tsx`, un componente exportado por archivo, **export nombrado** (`export function HeroTitle`), prefijo de la sección (`Features…`).

## 3. Reglas de implementación

1. **Server Component por defecto.** Agregar `"use client"` solo si el componente usa estado, efectos, eventos, `usePathname`/`useRouter`, `useLocale` o APIs del navegador. Aislar esa parte en el componente hoja más pequeño posible (ej.: `NavLink` es cliente; `NavList` no).
2. **Texto por props, ya traducido.** Atoms y molecules no llaman `useTranslations`. Las páginas (u organismos de layout como `SiteHeader`) traducen y pasan strings. Nunca texto hardcodeado.
3. **Tipos de props explícitos** (`interface XProps`). Reusar `ActionLink` y `NavLinkItem` de `@/presentation/helpers/types`. Exportar el tipo de props cuando un organismo lo compone (`HeroHeaderProps`).
4. **Estilos**: utilidades de Tailwind + tokens (`bg-background`, `text-muted-foreground`, `border-border`, `h-header`…). Combinar con `cn()` de `@/lib/utils` y aceptar `className` para extender. Variantes con `cva` (ver `Heading`, `Text`). Nada de colores hex ni valores mágicos repetidos.
5. **CSS propio** solo si no es expresable con utilidades (máscaras, patrones, keyframes): `src/styles/<nivel>/<nombre>.css` dentro de `@layer components`, importado desde `src/styles/<nivel>/index.css` (ejemplo: `styles/organisms/hero.css` → `.hero-backdrop`).
6. **Enlaces** con `Link` de `@/i18n/navigation` y rutas desde `ROUTES` (`@/constants/routes`). Botón-enlace: `<Button asChild><Link …/></Button>`.
7. **Semántica y a11y**: un solo `<h1>` por página; `<section aria-labelledby={titleId}>`; iconos decorativos `aria-hidden`; botones solo-icono con `<span className="sr-only">`; `aria-current="page"` en navegación; foco visible (`focus-visible:ring-2 focus-visible:ring-ring`).
8. **Sin datos ni lógica de negocio** en atoms/molecules. Un organismo puede consumir `use<Feature>()` y manejar los estados loading/error/empty (ver `/api-feature`).

## 4. Plantillas

### Atom (servidor)

```tsx
// src/presentation/atoms/main/<seccion>/<Seccion>Eyebrow.tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SeccionEyebrowProps {
  children: ReactNode;
  className?: string;
}

export function SeccionEyebrow({ children, className }: SeccionEyebrowProps) {
  return (
    <p className={cn("text-sm font-medium tracking-wide text-muted-foreground uppercase", className)}>
      {children}
    </p>
  );
}
```

### Molecule

```tsx
// src/presentation/molecules/main/<seccion>/<Seccion>Header.tsx
import { Heading } from "@/presentation/atoms/common/Heading";
import { Text } from "@/presentation/atoms/common/Text";
import { SeccionEyebrow } from "@/presentation/atoms/main/<seccion>/SeccionEyebrow";

export interface SeccionHeaderProps {
  titleId: string;
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SeccionHeader({ titleId, eyebrow, title, description }: SeccionHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? <SeccionEyebrow>{eyebrow}</SeccionEyebrow> : null}
      <Heading id={titleId} size="xl">{title}</Heading>
      {description ? <Text tone="muted">{description}</Text> : null}
    </div>
  );
}
```

### Organism (servidor, animado sin volverse cliente)

```tsx
// src/presentation/organisms/main/<seccion>/<Seccion>Section.tsx
import { Reveal } from "@/presentation/atoms/common/Reveal";
import { Container } from "@/presentation/atoms/layout/Container";
import { SeccionHeader, type SeccionHeaderProps } from "@/presentation/molecules/main/<seccion>/SeccionHeader";

type SeccionSectionProps = Omit<SeccionHeaderProps, "titleId"> & { id?: string };

export function SeccionSection({ id = "seccion", ...header }: SeccionSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <SeccionHeader titleId={titleId} {...header} />
        </Reveal>
      </Container>
    </section>
  );
}
```

Luego la página lo compone:

```tsx
const t = useTranslations("Home.seccion");
<SeccionSection title={t("title")} description={t("description")} />
```

### Template

Los templates solo disponen organismos y `children`. No traducen contenido de página ni consumen hooks de datos. Para un esqueleto nuevo (p. ej. páginas sin footer), crear `src/presentation/templates/<nombre>/<Nombre>Layout.tsx` siguiendo `MainLayout` y mantener `<main id={MAIN_CONTENT_ID} tabIndex={-1}>` para el skip link.

## 5. Animaciones (Motion)

- Providers ya montados en `AppProviders`: `LazyMotion` (features diferidas, **`strict`**) + `MotionConfig reducedMotion="user"`.
- Importar desde `"motion/react"` y usar **`m.div`, `m.li`…** Usar `motion.div` lanza error en runtime y lo marca `check:arch`.
- Aparición estándar: átomo `Reveal`.
  - `trigger="inView"` (por defecto) para contenido bajo el pliegue.
  - `trigger="mount"` para contenido visible al cargar; escalonar con `delay` (0, 0.15, 0.3).
  - Ten en cuenta que el contenido parte con `opacity: 0` hasta hidratar. No envolver en `Reveal` el elemento LCP si la métrica es crítica.
- Variantes y transiciones compartidas en `src/presentation/helpers/motion/variants.ts`. Agregar variantes ahí, no inline repetidas.
- Animaciones de listas o de salida: `AnimatePresence` + `m.*` dentro de un componente cliente (ver `components/toast/Toaster.tsx`).
- Animar solo `opacity` y `transform`. Nunca `width`, `height`, `top` ni `left`.

## 6. shadcn/ui

```bash
npx shadcn@latest add <componente>
```

Después de **cada** `add`:

1. Reemplazar `import { cn } from "cn"` por `import { cn } from "@/lib/utils"` en los archivos creados.
2. Si `package.json` ganó la dependencia `cn`, ejecutar `npm uninstall cn`.
3. Revisar que no se hayan agregado otras dependencias. Si aparece una nueva (p. ej. `sonner` o `vaul`), consultarlo con el usuario.
4. Los componentes de `components/ui` no se editan para casos puntuales: se envuelven en un atom o molecule.

Instalados: `button`, `badge`, `sheet`, `skeleton`, `separator`.

## 7. Iconos (Lucide)

```tsx
import { ArrowRight } from "lucide-react";
<ArrowRight aria-hidden />                               // decorativo junto a texto
<Button size="icon"><Menu aria-hidden /><span className="sr-only">{label}</span></Button>
```

El tamaño lo controla el contenedor (`[&_svg]:size-4` en `Button`) o `className="size-5"`.

## 8. Checklist

- [ ] Nivel y carpeta correctos (§1, §2); import-set sin niveles superiores.
- [ ] Sin `"use client"` innecesario; la parte cliente está aislada en una hoja.
- [ ] Todo el texto llega por props desde i18n; claves agregadas en `es`, `en` y `pt`.
- [ ] `className` extensible con `cn`, tokens del tema y variantes con `cva` si hay más de un estilo.
- [ ] A11y: headings en orden, `aria-labelledby`, iconos `aria-hidden`, foco visible, `sr-only` en botones de icono.
- [ ] Animaciones con `Reveal` o `m.*` y variantes compartidas.
- [ ] `npm run validate` pasa.
