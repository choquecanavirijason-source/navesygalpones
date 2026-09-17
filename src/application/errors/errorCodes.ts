/**
 * Códigos de error estables. Cada código tiene su traducción en el namespace
 * `Errors` de `src/messages/*.json` (la UI nunca muestra `error.message`).
 */
export const ERROR_CODES = {
  UNKNOWN: "UNKNOWN",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  NETWORK: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  UPSTREAM: "UPSTREAM_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_STATUS: Record<ErrorCode, number> = {
  UNKNOWN: 500,
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  NETWORK_ERROR: 503,
  TIMEOUT: 504,
  SERVICE_UNAVAILABLE: 503,
  UPSTREAM_ERROR: 502,
};

const KNOWN_CODES = new Set<string>(Object.values(ERROR_CODES));

export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && KNOWN_CODES.has(value);
}
