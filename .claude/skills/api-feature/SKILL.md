---
name: api-feature
description: Implementar una funcionalidad conectada a backend en esta landing Next.js siguiendo el flujo obligatorio de punta a punta. El recorrido es modelo y contratos en core, schema Zod, repositorio con IHttpClient inyectado, servicio de servidor, route handler en app/api como composition root con apiClient, servicio de navegador con apiLocal, hook SWR y organismo con estados de carga, error y vacío. Cubre AppError y ErrorHandler, el sobre ApiResponse, códigos de error traducibles, mutaciones con useSWRMutation, toasts, variables de entorno de servidor y seguridad (logging sin secretos). Úsalo cuando pidan conectar con una API o backend, crear un endpoint, un formulario que envía datos, listar datos remotos, o trabajes en src/app/api, application/services, infrastructure/repositories, infrastructure/validators o presentation/hooks/modules. La feature example es la referencia. Requiere landing-architecture. Slash: /api-feature
---

# Feature conectada a backend

Flujo obligatorio. **No saltar capas "porque es rápido"**:

```text
Organism
  → use<Feature>                 presentation/hooks/modules/<feature>/     SWR · composition root de cliente
  → <Feature>ClientService       application/services/client/<feature>/    implementa I<Feature>Service
  → apiLocal                     infrastructure/http/clients/apiLocal.ts   HttpClient → /api
  → route.ts                     app/api/<feature>/                        Zod · composition root de servidor
  → <Feature>Service             application/services/modules/<feature>/   lógica de negocio
  → <Feature>Repository          infrastructure/repositories/<feature>/    implementa I<Feature>Repository
  → apiClient                    infrastructure/http/clients/apiClient.ts  HttpClient → API_BASE_URL
  → backend externo
```

**Referencia viva**: la feature `example` implementa este flujo completo. Para una feature nueva, copiarla y renombrarla (ejemplo: `subscription`, `Subscription`). Los campos del modelo deben venir del contrato real del backend o del usuario; **no inventarlos**.

## Paso 1: `core`: forma de los datos y contratos

```ts
// src/core/models/Subscription.ts
export interface Subscription {
  id: string;
  // …campos definidos por el contrato real del backend
}
```

```ts
// src/core/types/modules/subscription/subscription.types.ts
import type { Subscription } from "@/core/models/Subscription";
export type CreateSubscriptionInput = Pick<Subscription, /* campos de entrada */ "id">;
```

```ts
// src/core/interfaces/modules/subscription/ISubscriptionRepository.ts
export interface ISubscriptionRepository {
  findAll(): Promise<Subscription[]>;
  create(input: CreateSubscriptionInput): Promise<Subscription>;
}

// src/core/interfaces/modules/subscription/ISubscriptionService.ts
export interface ISubscriptionService {
  list(): Promise<Subscription[]>;
  create(input: CreateSubscriptionInput): Promise<Subscription>;
}
```

`core` solo contiene `import type` de `core`. Sin Zod, sin clases con lógica.

## Paso 2: endpoints en `config/constants.ts`

```ts
export const LOCAL_API_ROUTES = { example: "/example", subscription: "/subscription" } as const;
export const UPSTREAM_ENDPOINTS = { example: "/example", subscription: "/subscriptions" } as const;
```

## Paso 3: validación con Zod

```ts
// src/infrastructure/validators/subscription/subscription.schema.ts
import { z } from "zod";
import type { CreateSubscriptionInput } from "@/core/types/modules/subscription/subscription.types";

export const createSubscriptionSchema = z.object({
  /* reglas por campo */
}) satisfies z.ZodType<CreateSubscriptionInput>;
```

El `satisfies` obliga a que el schema y el tipo de `core` coincidan. El mismo schema puede usarse en el cliente para validar un formulario antes de enviarlo (presentation puede importar `validators`).

## Paso 4: repositorio

```ts
// src/infrastructure/repositories/subscription/SubscriptionRepository.ts
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly http: IHttpClient) {}

  findAll(): Promise<Subscription[]> {
    return this.http.get<Subscription[]>(UPSTREAM_ENDPOINTS.subscription);
  }

  create(input: CreateSubscriptionInput): Promise<Subscription> {
    return this.http.post<Subscription, CreateSubscriptionInput>(UPSTREAM_ENDPOINTS.subscription, input);
  }
}
```

- Recibe `IHttpClient` por constructor. **Nunca** importa `apiClient`.
- Si el backend usa otra forma (sobres, snake_case, paginación), **mapear aquí** a los modelos de `core`. El resto del sistema no conoce la forma del backend.

## Paso 5: servicio de servidor

```ts
// src/application/services/modules/subscription/SubscriptionService.ts
export class SubscriptionService implements ISubscriptionService {
  constructor(private readonly repository: ISubscriptionRepository) {}

  list() { return this.repository.findAll(); }

  async create(input: CreateSubscriptionInput) {
    // reglas de negocio / orquestación de varios repositorios
    return this.repository.create(input);
  }
}
```

Para errores de negocio: `throw new AppError({ code: ERROR_CODES.CONFLICT, message: "…" })`.

## Paso 6: route handler (composition root de servidor)

```ts
// src/app/api/subscription/route.ts
const subscriptionService = new SubscriptionService(new SubscriptionRepository(apiClient));
const log = logger.child("api:subscription");

function handleError(error: unknown): Response {
  const appError = ErrorHandler.normalize(error);
  if (appError.isServerError) log.error(appError.message, { code: appError.code, status: appError.status });
  return ErrorHandler.toResponse(appError);
}

export async function GET(): Promise<Response> {
  try {
    const data = await subscriptionService.list();
    return Response.json({ success: true, data } satisfies ApiSuccessResponse<Subscription[]>);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonBody(request, createSubscriptionSchema);   // 400 / 422 automáticos
    const data = await subscriptionService.create(input);
    return Response.json({ success: true, data } satisfies ApiSuccessResponse<Subscription>, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
```

- Único lugar donde se importa `apiClient` (verificado por `check:arch`).
- Query string: `parseOrThrow(schema, Object.fromEntries(new URL(request.url).searchParams))`.
- Ruta con parámetro: `app/api/subscription/[id]/route.ts` con `{ params }: { params: Promise<{ id: string }> }` y validar `id` con Zod.
- **Nunca** loggear `appError.cause` ni la petición: el error de Axios incluye cabeceras (`Authorization`).

## Paso 7: servicio de navegador

```ts
// src/application/services/client/subscription/SubscriptionClientService.ts
export class SubscriptionClientService implements ISubscriptionService {
  constructor(private readonly http: IHttpClient) {}

  async list() {
    const res = await this.http.get<ApiSuccessResponse<Subscription[]>>(LOCAL_API_ROUTES.subscription);
    return res.data;
  }

  async create(input: CreateSubscriptionInput) {
    const res = await this.http.post<ApiSuccessResponse<Subscription>, CreateSubscriptionInput>(
      LOCAL_API_ROUTES.subscription,
      input,
    );
    return res.data;
  }
}
```

## Paso 8: hook SWR (composition root de cliente)

```ts
// src/presentation/hooks/modules/subscription/useSubscription.ts
const subscriptionService: ISubscriptionService = new SubscriptionClientService(apiLocal);

export const subscriptionKeys = { list: "subscription:list" } as const;

export function useSubscriptionList() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Subscription[], AppError>(
    subscriptionKeys.list,
    () => subscriptionService.list(),
  );
  return { items: data ?? [], error, isLoading, isValidating, refresh: mutate };
}

export function useCreateSubscription() {
  return useSWRMutation<Subscription, AppError, string, CreateSubscriptionInput>(
    subscriptionKeys.list,                       // revalida la lista al terminar
    (_key, { arg }) => subscriptionService.create(arg),
  );
}
```

- SWR **solo para lecturas** (`useSWR`). Las escrituras usan `useSWRMutation` o una llamada directa al servicio desde un handler.
- Claves con formato `"<feature>:<recurso>"` exportadas en `<feature>Keys`. Con parámetros: `[subscriptionKeys.detail, id]`, o `null` para no pedir.
- La configuración global (sin revalidar al enfocar, sin reintentos en 4xx) está en `src/config/swr.config.ts`.

## Paso 9: organismo que consume el hook

```tsx
"use client";

import { useTranslations } from "next-intl";

import { SectionSkeleton } from "@/components/loaders/SectionSkeleton";
import { Button } from "@/components/ui/button";
import { useSubscriptionList } from "@/presentation/hooks/modules/subscription/useSubscription";

export function SubscriptionListSection() {
  const t = useTranslations("Subscription");
  const tErrors = useTranslations("Errors");
  const tCommon = useTranslations("Common");
  const { items, error, isLoading, refresh } = useSubscriptionList();

  if (isLoading) return <SectionSkeleton />;
  if (error) {
    return (
      <div role="alert">
        <p>{tErrors(error.code)}</p>
        <Button variant="outline" onClick={() => void refresh()}>{tCommon("retry")}</Button>
      </div>
    );
  }
  if (items.length === 0) return <p>{t("empty")}</p>;

  return <ul>{items.map((item) => <li key={item.id}>{/* molecule por item */}</li>)}</ul>;
}
```

- Loading, error y vacío se manejan **siempre**.
- Mensajes de error: `tErrors(error.code)`. `error.message` es técnico y nunca se muestra.
- Feedback de escritura con toast:

```ts
const { trigger, isMutating } = useCreateSubscription();
try {
  await trigger(input);
  toast.success(t("created"));
} catch (error) {
  toast.error(tErrors(ErrorHandler.getMessageKey(error)));
}
```

(`toast` desde `@/lib/toast/toast.store`, o `useToast()` de `@/presentation/hooks/toast/useToast`.)

## Errores: referencia rápida

| Origen | Código | Status |
|---|---|---|
| JSON mal formado | `BAD_REQUEST` | 400 |
| Zod falla (`details`: `[{ path, message }]`) | `VALIDATION_ERROR` | 422 |
| Upstream 401 / 403 / 404 / 409 / 429 | mismo código | mismo status |
| Upstream 5xx | `UPSTREAM_ERROR` | 502 |
| Sin respuesta / timeout | `NETWORK_ERROR` / `TIMEOUT` | 503 / 504 |
| `API_BASE_URL` vacío | `SERVICE_UNAVAILABLE` | 503 |
| Excepción no controlada | `UNKNOWN` (mensaje ocultado) | 500 |

Código nuevo: agregarlo en `application/errors/errorCodes.ts` (`ERROR_CODES` + `ERROR_STATUS`) **y** en el namespace `Errors` de `es`, `en` y `pt`.

## Configuración y seguridad

- Variables de servidor en `src/config/config.ts` (schema Zod de `getServerConfig`) y documentadas en `.env.example`. **Nunca** con prefijo `NEXT_PUBLIC_` si son secretas.
- Cabeceras de autenticación del backend: en `apiClient.ts` (ya envía `Authorization: Bearer ${API_TOKEN}` si existe).
- El navegador **nunca** llama al backend externo directamente: siempre a través de `/api`.
- Correo: `IMailer` (`infrastructure/mailer`). Hoy es `ConsoleMailer` (solo registra en el log). Un transporte real requiere aprobar la librería con el usuario.

## Checklist

- [ ] Modelo, tipos e interfaces en `core` (sin dependencias).
- [ ] Endpoints en `LOCAL_API_ROUTES` y `UPSTREAM_ENDPOINTS`.
- [ ] Schema Zod con `satisfies z.ZodType<…>`.
- [ ] Repositorio y servicios reciben dependencias por constructor.
- [ ] `route.ts` valida, compone con `apiClient`, responde con `ApiResponse` y usa `ErrorHandler`.
- [ ] Hook SWR con claves exportadas; el organismo maneja loading, error y vacío con i18n.
- [ ] Textos y códigos de error nuevos en los 3 idiomas.
- [ ] `npm run validate` y `npm run build` pasan.
- [ ] Probado: `curl /api/<feature>` devuelve el sobre esperado (éxito, 400, 422).
