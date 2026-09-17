---
name: landing-architecture
description: Skill maestro de la arquitectura de esta landing Next.js 16 por capas (core, application, infrastructure, presentation) con Atomic Design. Define la responsabilidad de cada carpeta, dónde va cada archivo nuevo, la convención client/ vs modules/, las reglas de dependencia verificadas por scripts/check-architecture.mjs, los composition roots y el flujo de datos hasta el backend. Úsalo antes de crear, mover o refactorizar cualquier archivo en src/, cuando haya dudas de en qué capa va algo, al revisar imports entre capas o cuando npm run check:arch falle. Complementa atomic-component, landing-page, api-feature e i18n-messages. Slash: /landing-architecture
---

# Arquitectura de la landing

Composición de cada pantalla:

```text
app/[locale]/<ruta>/page.tsx   (metadata + setRequestLocale)
  → presentation/pages/<ruta>/<Nombre>Page.tsx
    → presentation/templates/main/MainLayout.tsx
      → presentation/organisms/…
        → presentation/molecules/…
          → presentation/atoms/…  (+ components/ui de shadcn)
```

Stack cerrado: Next.js 16, React 19, TypeScript 5 strict, Tailwind v4, shadcn/ui, next-intl, Axios encapsulado en `HttpClient`, SWR, Zod, Motion (`LazyMotion` + `m.*`), Lucide. **No agregar dependencias sin preguntar al usuario.**

## 1. ¿Dónde va este archivo?

| Si el archivo es… | Va en |
|---|---|
| Una ruta, layout, `generateMetadata`, sitemap/robots/manifest | `src/app/` |
| Un endpoint HTTP propio | `src/app/api/<feature>/route.ts` |
| La forma de un dato (entidad) | `src/core/models/<Entidad>.ts` |
| Un input/DTO/tipo de una feature | `src/core/types/modules/<feature>/<feature>.types.ts` |
| El sobre de respuesta de la API interna | `src/core/types/api/api.types.ts` (ya existe) |
| Un contrato de repositorio o servicio | `src/core/interfaces/modules/<feature>/I<Feature>{Repository,Service}.ts` |
| Un contrato de cliente técnico (HTTP, storage, logger, mailer) | `src/core/interfaces/client/I<Nombre>.ts` |
| Lógica de negocio del servidor | `src/application/services/modules/<feature>/<Feature>Service.ts` |
| Llamadas del navegador a `/api` | `src/application/services/client/<feature>/<Feature>ClientService.ts` |
| Un código de error nuevo | `src/application/errors/errorCodes.ts` + clave en `Errors` de los 3 JSON |
| Acceso a un backend externo | `src/infrastructure/repositories/<feature>/<Feature>Repository.ts` |
| Un schema Zod | `src/infrastructure/validators/<feature>/<feature>.schema.ts` |
| Persistencia en el navegador | `src/infrastructure/storage/` (implementa `IStorage`) |
| UI | `src/presentation/{atoms,molecules,organisms,templates,pages}/` → ver `/atomic-component` |
| Un hook SWR de una feature | `src/presentation/hooks/modules/<feature>/use<Feature>.ts` |
| Un hook genérico de navegador | `src/presentation/hooks/client/` (`mobile/` y `toast/` para esos casos) |
| Tipos o helpers solo de UI (variantes de Motion, tipos de props compartidos) | `src/presentation/helpers/` |
| Datos ficticios para maquetar estados | `src/presentation/mocks/` (nunca importados por páginas finales) |
| Un componente shadcn | `src/components/ui/` (vía CLI) |
| Un spinner o skeleton reutilizable | `src/components/loaders/` |
| Variables de entorno | `src/config/config.ts` (validadas con Zod) + `.env.example` |
| Endpoints, timeouts, límites | `src/config/constants.ts` |
| Rutas de la app, breakpoints, ids de UI | `src/constants/` |
| Estructura de menús (qué enlaces, en qué orden) | `src/content/` |
| Un texto visible | `src/messages/{es,en,pt}.json` → ver `/i18n-messages` |
| Utilidades transversales sin estado (seo, navegación, toast store) | `src/lib/<área>/` |
| CSS que no se puede expresar con utilidades | `src/styles/{atoms,molecules,organisms}/<nombre>.css` + `@import` en su `index.css` |
| Declaraciones globales `.d.ts` | `src/types/` |

Carpetas reservadas y vacías (`.gitkeep`) hasta aprobar la librería: `core/threejs`, `lib/threejs`, `components/shaders`.

## 2. Convención `client/` vs `modules/`

- **`client/`** = piezas técnicas o del lado navegador: contratos de clientes técnicos (`IHttpClient`, `ILogger`, `IMailer`, `IStorage`), servicios de navegador que llaman a `/api`, hooks genéricos de navegador.
- **`modules/`** = piezas de una feature concreta: contratos, DTOs, servicios de servidor, hooks SWR de la feature.

Una feature `X` implementa **un** contrato `IXService` con **dos** servicios: `XService` (servidor, usa repositorio) y `XClientService` (navegador, usa `apiLocal`). Así el hook y la ruta hablan el mismo idioma.

## 3. Reglas de dependencia

```text
            ┌──────────── app (composition root) ────────────┐
            ▼                                                ▼
      presentation ──► application ──► core ◄── infrastructure
            │               ▲                        │
            └─► components  └──── application/errors ◄┘
```

| Capa | Puede importar | Nunca importa |
|---|---|---|
| `core` | solo `core` | todo lo demás, incluidos paquetes npm |
| `application` | `core`, `config`, `constants` | `infrastructure`, `presentation`, `components`, `app`, `lib`, `i18n`, React/Next/Axios/SWR |
| `infrastructure` | `core`, `application/errors`, `config`, `constants`, axios, zod | UI, `app`, `lib`, `i18n`, servicios |
| `presentation` | `core`, `application`, `apiLocal`, `validators`, `storage`, `components`, `lib`, `i18n`, `config`, `constants`, `content` | `apiClient`, repositorios, `http/base`, mailer, `services/modules`, `axios`, `app` |
| `components` | `lib`, `config`, `constants`, paquetes UI | `presentation`, `application`, `infrastructure` |
| `app/[locale]` | `presentation/pages`, `presentation/templates/app`, `lib/seo`, `i18n`, `config`, `constants` | `infrastructure`, `application/services`, `components`, axios, swr |
| `app/api` | todo (composition root de servidor) | componentes de UI |
| `lib` | `core`, `config`, `constants`, `i18n` | `presentation`, `app`, `application`, `infrastructure` |
| `config` / `constants` / `content` | `core`, `config`, `constants`, `messages` | resto |

Reglas extra:

- `apiClient` **solo** en `src/app/api/**`. Allí se inyecta en el repositorio: `new XService(new XRepository(apiClient))`.
- Jerarquía atómica estricta: atoms < molecules < organisms < templates < pages. Un nivel nunca importa uno superior.
- Atoms y molecules no consumen `hooks/modules` (reciben datos por props).
- Motion desde `motion/react` y solo `m.*`.

Verificación automática: `npm run check:arch`. Si falla, **corregir el diseño**, no el script. Si una regla parece estar mal, consultarlo con el usuario antes de cambiar `scripts/check-architecture.mjs`.

## 4. Flujo de datos

```text
Organism ─► use<Feature> (SWR) ─► <Feature>ClientService ─► apiLocal ─► /api/<feature>
   ─► route.ts (Zod) ─► <Feature>Service ─► <Feature>Repository ─► apiClient ─► backend
```

- Respuestas de `/api`: `{ success: true, data, meta? }` o `{ success: false, error: { code, message, details? } }`.
- Errores: `HttpClient` y `ErrorHandler.normalize` convierten todo en `AppError`. La ruta responde con `ErrorHandler.toResponse`. La UI muestra `t(\`Errors.${error.code}\`)`.
- Pasos detallados para una feature nueva: `/api-feature`.

## 5. Antipatrones

- ❌ Lógica, `fetch` o JSX complejo dentro de `app/[locale]/**/page.tsx`.
- ❌ Un servicio que hace `new SomeRepository()` o importa `apiClient`: las dependencias se inyectan.
- ❌ Un hook o componente que llama a Axios, a `apiClient` o a un repositorio.
- ❌ Tipos de dominio definidos dentro de un componente o un schema Zod como única fuente del tipo: el tipo vive en `core` y el schema lo `satisfies`.
- ❌ Crear `src/services`, `src/utils`, `src/hooks` u otras carpetas paralelas a las capas.
- ❌ Barrel files (`index.ts`) que reexportan capas enteras: ocultan dependencias al checker y rompen el tree-shaking.
- ❌ Texto visible hardcodeado en componentes.
- ❌ Inventar contenido de negocio: usar placeholders genéricos.

## 6. Checklist antes de terminar

- [ ] Cada archivo nuevo está en la carpeta que indica la tabla §1.
- [ ] `npm run validate` pasa (typecheck + arquitectura + i18n).
- [ ] `npm run build` pasa si se tocaron rutas, metadata, proxy o configuración.
- [ ] No se agregaron dependencias (o el usuario las aprobó explícitamente).
- [ ] `CLAUDE.md` sigue siendo cierto (actualizarlo si cambió una convención).
