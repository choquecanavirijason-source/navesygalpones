import type { ValidationIssue } from "@/core/types/api/api.types";
import { ERROR_CODES, ERROR_STATUS, type ErrorCode } from "@/application/errors/errorCodes";

interface AppErrorParams {
  code: ErrorCode;
  message: string;
  status?: number;
  details?: unknown;
  cause?: unknown;
}

/** Único tipo de error que cruza capas. HttpClient y ErrorHandler normalizan todo a AppError. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor({ code, message, status, details, cause }: AppErrorParams) {
    super(message, { cause });
    this.name = "AppError";
    this.code = code;
    this.status = status ?? ERROR_STATUS[code];
    this.details = details;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  static validation(issues: ValidationIssue[], message = "Validation failed"): AppError {
    return new AppError({ code: ERROR_CODES.VALIDATION, message, details: issues });
  }

  static badRequest(message = "Bad request", cause?: unknown): AppError {
    return new AppError({ code: ERROR_CODES.BAD_REQUEST, message, cause });
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError({ code: ERROR_CODES.NOT_FOUND, message });
  }

  static serviceUnavailable(message = "Service unavailable"): AppError {
    return new AppError({ code: ERROR_CODES.SERVICE_UNAVAILABLE, message });
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
