import type { ExampleItem } from "@/core/models/Example";
import type { ApiSuccessResponse } from "@/core/types/api/api.types";
import { ErrorHandler } from "@/application/errors/ErrorHandler";
import { ExampleService } from "@/application/services/modules/example/ExampleService";
import { apiClient } from "@/infrastructure/http/clients/apiClient";
import { logger } from "@/infrastructure/logger/Logger";
import { ExampleRepository } from "@/infrastructure/repositories/example/ExampleRepository";
import { parseJsonBody } from "@/infrastructure/validators/common/validate";
import { createExampleSchema } from "@/infrastructure/validators/example/example.schema";

/*
 * Feature de referencia. Flujo:
 * hook (SWR) → ExampleClientService → apiLocal → [esta ruta]
 *   → Zod → ExampleService → ExampleRepository → apiClient → backend externo
 *
 * Composition root: único lugar donde se instancian repositorio + servicio con `apiClient`.
 */
const exampleService = new ExampleService(new ExampleRepository(apiClient));
const log = logger.child("api:example");

function handleError(error: unknown): Response {
  const appError = ErrorHandler.normalize(error);
  // No se registra `cause`: puede incluir la configuración de Axios con cabeceras sensibles.
  if (appError.isServerError) {
    log.error(appError.message, { code: appError.code, status: appError.status });
  }
  return ErrorHandler.toResponse(appError);
}

export async function GET(): Promise<Response> {
  try {
    const data = await exampleService.list();
    return Response.json({ success: true, data } satisfies ApiSuccessResponse<ExampleItem[]>);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const input = await parseJsonBody(request, createExampleSchema);
    const data = await exampleService.create(input);
    return Response.json({ success: true, data } satisfies ApiSuccessResponse<ExampleItem>, {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
