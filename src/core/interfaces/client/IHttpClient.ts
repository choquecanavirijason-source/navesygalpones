import type { HttpRequestOptions } from "@/core/types/client/http.types";

/**
 * Contrato del cliente HTTP. Los servicios y repositorios dependen de esta
 * interfaz, nunca de Axios ni de una instancia concreta.
 */
export interface IHttpClient {
  get<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>;
  post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;
  put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;
  patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: HttpRequestOptions,
  ): Promise<TResponse>;
  delete<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>;
}
