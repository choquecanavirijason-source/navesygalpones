import type { SWRConfiguration } from "swr";

const MAX_ERROR_RETRIES = 2;

const getStatus = (error: unknown): number | undefined =>
  typeof error === "object" && error !== null && "status" in error && typeof error.status === "number"
    ? error.status
    : undefined;

/** Configuración global de SWR (se aplica en `AppProviders`). Solo lecturas. */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateIfStale: true,
  keepPreviousData: true,
  dedupingInterval: 5_000,
  onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
    const status = getStatus(error);
    // Los errores 4xx no se resuelven reintentando.
    if (status !== undefined && status < 500) return;
    if (retryCount >= MAX_ERROR_RETRIES) return;

    setTimeout(() => void revalidate({ retryCount }), 2 ** retryCount * 1_000);
  },
};
