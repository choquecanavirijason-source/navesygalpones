import type { IHttpClient } from "@/core/interfaces/client/IHttpClient";
import { getServerConfig } from "@/config/config";
import { HttpClient } from "@/infrastructure/http/base/HttpClient";

/**
 * Cliente del BACKEND EXTERNO. Solo servidor.
 *
 * Regla de arquitectura: se importa únicamente desde `src/app/api/**`, que actúa
 * como composition root y lo inyecta en los repositorios. Verificado por
 * `npm run check:arch`.
 */
function createApiClient(): IHttpClient {
  const { apiBaseUrl, apiTimeoutMs, apiToken } = getServerConfig();

  return new HttpClient({
    baseURL: apiBaseUrl,
    timeout: apiTimeoutMs,
    headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : undefined,
  });
}

export const apiClient: IHttpClient = createApiClient();
