import axios, { isAxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

import type { IHttpClient } from "@/core/interfaces/client/IHttpClient";
import type { ApiErrorResponse } from "@/core/types/api/api.types";
import type { HttpClientConfig, HttpRequestOptions } from "@/core/types/client/http.types";
import { AppError, isAppError } from "@/application/errors/AppError";
import { ErrorHandler } from "@/application/errors/ErrorHandler";
import { ERROR_CODES, isErrorCode } from "@/application/errors/errorCodes";
import { HTTP_TIMEOUT_MS } from "@/config/constants";

const ABSOLUTE_URL = /^https?:\/\//i;

/**
 * Único punto del proyecto que conoce Axios. Toda respuesta se devuelve ya
 * desempaquetada (`response.data`) y todo fallo se lanza como `AppError`.
 */
export class HttpClient implements IHttpClient {
  private readonly instance: AxiosInstance;
  private readonly baseURL: string;

  constructor({ baseURL, timeout = HTTP_TIMEOUT_MS, headers }: HttpClientConfig) {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL: baseURL || undefined,
      timeout,
      headers: { Accept: "application/json", ...headers },
    });
  }

  get<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse> {
    return this.request<TResponse>({ ...toAxiosConfig(options), method: "GET", url });
  }

  post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...toAxiosConfig(options), method: "POST", url, data: body });
  }

  put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...toAxiosConfig(options), method: "PUT", url, data: body });
  }

  patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>({ ...toAxiosConfig(options), method: "PATCH", url, data: body });
  }

  delete<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse> {
    return this.request<TResponse>({ ...toAxiosConfig(options), method: "DELETE", url });
  }

  private async request<TResponse>(config: AxiosRequestConfig): Promise<TResponse> {
    if (!this.baseURL && !ABSOLUTE_URL.test(config.url ?? "")) {
      throw AppError.serviceUnavailable(`HttpClient has no baseURL to resolve "${config.url}"`);
    }

    try {
      const response = await this.instance.request<TResponse>(config);
      return response.data;
    } catch (error) {
      throw toAppError(error);
    }
  }
}

function toAxiosConfig(options?: HttpRequestOptions): AxiosRequestConfig {
  return {
    params: options?.params,
    headers: options?.headers,
    signal: options?.signal,
    timeout: options?.timeout,
  };
}

function isApiErrorResponse(body: unknown): body is ApiErrorResponse {
  if (typeof body !== "object" || body === null) return false;
  if (!("success" in body) || body.success !== false || !("error" in body)) return false;

  const { error } = body;
  return typeof error === "object" && error !== null && "code" in error && "message" in error;
}

/**
 * Normaliza errores de Axios. Nunca adjunta la configuración de la petición
 * al mensaje: puede contener cabeceras sensibles (Authorization).
 */
function toAppError(error: unknown): AppError {
  if (isAppError(error)) return error;
  if (!isAxiosError(error)) return ErrorHandler.normalize(error);

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new AppError({ code: ERROR_CODES.TIMEOUT, message: "Request timed out", cause: error });
  }

  const { response } = error;
  if (!response) {
    return new AppError({ code: ERROR_CODES.NETWORK, message: "Network error", cause: error });
  }

  const body: unknown = response.data;
  const code =
    isApiErrorResponse(body) && isErrorCode(body.error.code)
      ? body.error.code
      : ErrorHandler.codeFromStatus(response.status);

  return new AppError({
    code,
    message: isApiErrorResponse(body) ? body.error.message : `Request failed with status ${response.status}`,
    // Los 5xx remotos se reportan con el status propio del código (p. ej. 502), no con el del upstream.
    status: response.status >= 500 ? undefined : response.status,
    details: isApiErrorResponse(body) ? body.error.details : undefined,
    cause: error,
  });
}
