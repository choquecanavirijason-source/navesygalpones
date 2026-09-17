import type { IHttpClient } from "@/core/interfaces/client/IHttpClient";
import type { IExampleRepository } from "@/core/interfaces/modules/example/IExampleRepository";
import type { ExampleItem } from "@/core/models/Example";
import type { CreateExampleInput } from "@/core/types/modules/example/example.types";
import { UPSTREAM_ENDPOINTS } from "@/config/constants";

/**
 * Repositorio HTTP de `example`. Recibe el cliente por constructor
 * (`apiClient`, inyectado desde la ruta API). Ajustar el mapeo a la
 * forma real de las respuestas del backend.
 */
export class ExampleRepository implements IExampleRepository {
  constructor(private readonly http: IHttpClient) {}

  findAll(): Promise<ExampleItem[]> {
    return this.http.get<ExampleItem[]>(UPSTREAM_ENDPOINTS.example);
  }

  create(input: CreateExampleInput): Promise<ExampleItem> {
    return this.http.post<ExampleItem, CreateExampleInput>(UPSTREAM_ENDPOINTS.example, input);
  }
}
