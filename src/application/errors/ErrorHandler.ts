import type { ApiErrorResponse } from "@/core/types/api/api.types";
import { AppError, isAppError } from "@/application/errors/AppError";
import { ERROR_CODES, type ErrorCode } from "@/application/errors/errorCodes";

const CODE_BY_STATUS: Record<number, ErrorCode> = {
  400: ERROR_CODES.BAD_REQUEST,
  401: ERROR_CODES.UNAUTHORIZED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  409: ERROR_CODES.CONFLICT,
  422: ERROR_CODES.VALIDATION,
  429: ERROR_CODES.RATE_LIMITED,
  503: ERROR_CODES.SERVICE_UNAVAILABLE,
  504: ERROR_CODES.TIMEOUT,
};

/** Punto único para normalizar errores y traducirlos a HTTP o a claves de UI. */
export const ErrorHandler = {
  /** Convierte cualquier valor lanzado en un `AppError`. */
  normalize(error: unknown): AppError {
    if (isAppError(error)) return error;

    return new AppError({
      code: ERROR_CODES.UNKNOWN,
      message: error instanceof Error ? error.message : "Unexpected error",
      cause: error,
    });
  },

  /** Código de error correspondiente a un status HTTP (para respuestas sin sobre `ApiErrorResponse`). */
  codeFromStatus(status: number): ErrorCode {
    const code = CODE_BY_STATUS[status];
    if (code) return code;
    return status >= 500 ? ERROR_CODES.UPSTREAM : ERROR_CODES.UNKNOWN;
  },

  /** Sobre JSON que devuelven las rutas `app/api/*`. No expone detalles internos de errores 5xx. */
  toResponseBody(error: AppError): ApiErrorResponse {
    const exposeMessage = error.code !== ERROR_CODES.UNKNOWN;

    return {
      success: false,
      error: {
        code: error.code,
        message: exposeMessage ? error.message : "Unexpected error",
        ...(error.code === ERROR_CODES.VALIDATION ? { details: error.details } : {}),
      },
    };
  },

  /** Respuesta HTTP estándar (Web `Response`) lista para devolver desde un route handler. */
  toResponse(error: unknown): Response {
    const appError = ErrorHandler.normalize(error);
    return Response.json(ErrorHandler.toResponseBody(appError), { status: appError.status });
  },

  /** Clave de traducción del namespace `Errors` para mostrar en la UI. */
  getMessageKey(error: unknown): ErrorCode {
    return ErrorHandler.normalize(error).code;
  },
};
