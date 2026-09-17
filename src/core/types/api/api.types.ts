/**
 * Contrato de respuesta de las rutas internas `app/api/*`.
 * Todas las respuestas JSON de la API local usan uno de estos dos sobres.
 */

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  /** Código estable y traducible (ver `application/errors/errorCodes.ts`). */
  code: string;
  /** Mensaje técnico, no apto para mostrarse al usuario final. */
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

export interface ValidationIssue {
  path: string;
  message: string;
}
