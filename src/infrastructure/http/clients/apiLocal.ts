import type { IHttpClient } from "@/core/interfaces/client/IHttpClient";
import { HTTP_TIMEOUT_MS, LOCAL_API_BASE_URL } from "@/config/constants";
import { HttpClient } from "@/infrastructure/http/base/HttpClient";

/**
 * Cliente de la API INTERNA (`src/app/api`). Se usa desde el navegador,
 * inyectado en los servicios de `application/services/client`.
 */
export const apiLocal: IHttpClient = new HttpClient({
  baseURL: LOCAL_API_BASE_URL,
  timeout: HTTP_TIMEOUT_MS,
});
