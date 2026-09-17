export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpHeaders = Record<string, string>;

export type HttpQueryParams = Record<string, string | number | boolean | null | undefined>;

export interface HttpRequestOptions {
  params?: HttpQueryParams;
  headers?: HttpHeaders;
  signal?: AbortSignal;
  timeout?: number;
}

export interface HttpClientConfig {
  /** URL base. Vacía = el cliente no puede resolver rutas relativas. */
  baseURL: string;
  timeout?: number;
  headers?: HttpHeaders;
}
