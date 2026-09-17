/** Constantes técnicas de configuración (transporte, caché, límites). */

export const HTTP_TIMEOUT_MS = 10_000;

/** Base de la API interna (`src/app/api`). La consume `apiLocal` desde el navegador. */
export const LOCAL_API_BASE_URL = "/api";

/** Rutas de la API interna, relativas a `LOCAL_API_BASE_URL`. */
export const LOCAL_API_ROUTES = {
  example: "/example",
} as const;

/** Endpoints del backend externo, relativos a `API_BASE_URL`. Solo los usa `apiClient`. */
export const UPSTREAM_ENDPOINTS = {
  example: "/example",
} as const;

export const TOAST_LIMIT = 3;
export const TOAST_DURATION_MS = 5_000;

export const STORAGE_KEY_PREFIX = "app:";
