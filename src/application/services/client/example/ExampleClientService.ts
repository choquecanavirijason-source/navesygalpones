import type { IHttpClient } from "@/core/interfaces/client/IHttpClient";
import type { IExampleService } from "@/core/interfaces/modules/example/IExampleService";
import type { ExampleItem } from "@/core/models/Example";
import type { ApiSuccessResponse } from "@/core/types/api/api.types";
import type { CreateExampleInput } from "@/core/types/modules/example/example.types";
import { LOCAL_API_ROUTES } from "@/config/constants";

/**
 * Servicio de navegador de `example`: consume la API interna (`/api/example`)
 * mediante el `IHttpClient` inyectado (`apiLocal`) y desempaqueta el sobre `ApiResponse`.
 */
export class ExampleClientService implements IExampleService {
  constructor(private readonly http: IHttpClient) {}

  async list(): Promise<ExampleItem[]> {
    const response = await this.http.get<ApiSuccessResponse<ExampleItem[]>>(
      LOCAL_API_ROUTES.example,
    );
    return response.data;
  }

  async create(input: CreateExampleInput): Promise<ExampleItem> {
    const response = await this.http.post<ApiSuccessResponse<ExampleItem>, CreateExampleInput>(
      LOCAL_API_ROUTES.example,
      input,
    );
    return response.data;
  }
}
