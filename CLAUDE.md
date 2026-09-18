# CLAUDE.md

Landing page en Next.js organizada por capas (core → application → infrastructure → presentation) con Atomic Design dentro de `presentation/`.

## Estado del proyecto

Etapa de **estructura**. No inventar datos de negocio, textos comerciales, productos, imágenes ni contenido de marca. Usar placeholders mínimos y genéricos (`"Título"`, `"Descripción."`) solo cuando hagan falta para compilar. La feature `example` es una **plantilla de referencia** del flujo de datos, no una funcionalidad real.

## Stack (cerrado)

Next.js 16 (App Router, `src/`, `proxy.ts`) · React 19 · TypeScript 5 `strict` · Tailwind CSS v4 · shadcn/ui · next-intl 4 · Axios (solo dentro de `HttpClient`) · SWR (lecturas) · Zod 4 · Motion (`LazyMotion` + `m.*`) · Lucide React.

**No agregar librerías sin consultar al usuario.** Esto incluye lo que suele venir "por defecto" (next-themes, sonner, react-hook-form, ESLint, etc.). Si una tarea parece necesitar una, proponerla y esperar confirmación.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # build de producción (incluye type-check de Next)
npm run typecheck    # tsc --noEmit
npm run check:arch   # reglas de dependencia entre capas (scripts/check-architecture.mjs)
npm run check:i18n   # paridad de claves y argumentos ICU entre idiomas
npm run validate     # typecheck + check:arch + check:i18n  ← correr antes de dar algo por terminado
```

## Arquitectura

```text
src/
├── app/             Rutas, layouts, metadata, sitemap/robots/manifest, API routes. Nada más.
├── proxy.ts         next-intl: negociación de idioma y prefijo /[locale]
├── core/            Tipos, interfaces, modelos, contratos. CERO imports fuera de core.
├── application/     Servicios (dependen de interfaces de core) + errores (AppError, ErrorHandler)
├── infrastructure/  HttpClient (Axios), apiClient/apiLocal, repositorios, validadores Zod, storage, logger, mailer
├── presentation/    atoms → molecules → organisms → templates → pages, hooks, helpers, mocks
├── components/      Base visual: ui/ (shadcn), loaders/, toast/, shaders/
├── i18n/            routing.ts · request.ts · navigation.ts
├── messages/        es.json (fuente de tipos) · en.json · pt.json
├── config/          config.ts (env validado) · constants.ts · swr.config.ts
├── constants/       Rutas, breakpoints, ids de UI
├── content/         Configuración estructural (navegación) — el texto va en messages/
├── lib/             utils.ts (cn) · toast/ · seo/ · navigation/ · threejs/
├── styles/          globals.css (tokens) + atoms/ molecules/ organisms/ (solo CSS no expresable en utilidades)
└── types/           Declaraciones globales (.d.ts)
```

### Convención `client/` vs `modules/`

| Carpeta | `client/` | `modules/` |
|---|---|---|
| `core/interfaces` | Contratos de clientes técnicos: `IHttpClient`, `ILogger`, `IMailer`, `IStorage` | Contratos por feature: `I<Feature>Repository`, `I<Feature>Service` |
| `core/types` | Tipos de clientes técnicos (HTTP, logs, mail) | DTOs/inputs por feature |
| `application/services` | Servicio **de navegador** por feature: consume `/api` vía `IHttpClient` (apiLocal) | Servicio **de servidor** por feature: consume `I<Feature>Repository` |
| `presentation/hooks` | Hooks genéricos de navegador (`useMediaQuery`, `useMounted`) | Hooks SWR por feature (`use<Feature>`) |

`core/types/api` contiene el sobre de respuesta de la API interna (`ApiSuccessResponse`, `ApiErrorResponse`).

### Flujo de datos (funcionalidad conectada a backend)

```text
Organism
  → presentation/hooks/modules/<feature>/use<Feature>.ts        (SWR; composition root de cliente)
  → application/services/client/<feature>/<Feature>ClientService (implementa I<Feature>Service)
  → infrastructure/http/clients/apiLocal                         (HttpClient → /api)
  → app/api/<feature>/route.ts                                   (valida con Zod; composition root de servidor)
  → application/services/modules/<feature>/<Feature>Service      (lógica de negocio)
  → infrastructure/repositories/<feature>/<Feature>Repository    (implementa I<Feature>Repository)
  → infrastructure/http/clients/apiClient                        (HttpClient → API_BASE_URL)
  → backend externo
```

- Las dependencias concretas se **inyectan por constructor**. Solo hay dos composition roots: la ruta `app/api/<feature>/route.ts` (servidor) y el hook `use<Feature>.ts` (cliente).
- `apiClient` se importa **únicamente** en `src/app/api/**`.
- Todo error cruza capas como `AppError` (código estable + status). La UI traduce `error.code` con el namespace `Errors`; nunca muestra `error.message`.

### Reglas de dependencia (verificadas por `npm run check:arch`)

- `core` no importa nada fuera de `core` (ni paquetes externos).
- `application` no importa `infrastructure`, `presentation`, `components`, `app`, `lib`, `i18n`, ni React/Next/Axios/SWR.
- `infrastructure` no importa UI, `app`, `lib` ni `i18n`; de `application` solo `application/errors`.
- `presentation` y `components` no importan `apiClient`, repositorios, `http/base`, mailer, servicios de `modules/` ni `axios`.
- `components` no importa `presentation`, `application` ni `infrastructure`.
- `app/[locale]` (no API) no importa `infrastructure`, `application/services`, `components`, `axios` ni `swr`: solo envuelve páginas.
- Jerarquía atómica: un nivel nunca importa uno superior (atoms < molecules < organisms < templates < pages). Atoms y molecules no usan hooks de datos.
- Motion: importar desde `motion/react` y usar `m.*`; nunca `motion.*` ni `framer-motion`.

## Convenciones de UI

- **Server Components por defecto.** `"use client"` solo en el componente hoja que necesita estado, efectos o APIs del navegador.
- Atoms y molecules reciben **texto ya traducido por props**. Las páginas (o los organismos de layout) resuelven i18n.
- `app/[locale]/**/page.tsx` = `generateMetadata` + `setRequestLocale` + `<XxxPage />`. Sin JSX adicional.
- Enlaces y navegación: `Link`, `usePathname`, `useRouter` de `@/i18n/navigation` (nunca `next/link` ni `next/navigation`, salvo `notFound`).
- Animaciones: átomo `Reveal` o `m.*` con variantes de `presentation/helpers/motion/variants.ts`.
- Iconos Lucide decorativos con `aria-hidden`; botones solo-icono con `<span className="sr-only">`.
- Estilos con utilidades de Tailwind y tokens de `globals.css`. CSS propio solo en `styles/{atoms,molecules,organisms}/` cuando no se pueda expresar con utilidades.
- shadcn: `npx shadcn@latest add <componente>` y **después** corregir el import de `cn` a `@/lib/utils` (el CLI lo reescribe como `"cn"` e instala un paquete npm `cn` que hay que desinstalar).

## Nombres

- Componentes, clases e interfaces: `PascalCase.tsx` / `IPascalCase.ts`. Hooks: `useCamelCase.ts`. Schemas: `<feature>.schema.ts`. Tipos: `<feature>.types.ts`.
- Organizar por sección dentro de cada nivel: `presentation/{atoms,molecules,organisms}/{common,layout,main/<seccion>}/`.
- Namespaces i18n en PascalCase (`Home.hero`, `Metadata.home`, `Errors`).

## Skills del proyecto (`.claude/skills/`)

- `/landing-architecture`: mapa de capas, dónde va cada archivo y reglas de dependencia.
- `/atomic-component`: crear atoms, molecules, organisms y templates.
- `/landing-page`: agregar una página o ruta localizada completa.
- `/api-feature`: funcionalidad conectada a backend de punta a punta.
- `/i18n-messages`: traducciones, namespaces e idiomas.

## Notas conocidas

- La 404 de rutas localizadas (`[...notFound]` → `[locale]/not-found.tsx`) responde `404` y se dibuja en el cliente desde el payload RSC: Next 16 no la renderiza en el HTML inicial cuando el layout raíz es dinámico (`[locale]`). `experimental.globalNotFound` es la alternativa documentada si se necesita HTML sin JS.
- `tailwind.config.ts` se carga con `@config` solo para plugins/safelist; los tokens viven en `src/styles/globals.css`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
