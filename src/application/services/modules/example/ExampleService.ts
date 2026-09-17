import type { IExampleRepository } from "@/core/interfaces/modules/example/IExampleRepository";
import type { IExampleService } from "@/core/interfaces/modules/example/IExampleService";
import type { ExampleItem } from "@/core/models/Example";
import type { CreateExampleInput } from "@/core/types/modules/example/example.types";

/**
 * Servicio de servidor de `example`. Se instancia en `app/api/example/route.ts`
 * inyectando el repositorio. Aquí va la lógica de negocio (reglas, orquestación).
 */
export class ExampleService implements IExampleService {
  constructor(private readonly repository: IExampleRepository) {}

  list(): Promise<ExampleItem[]> {
    return this.repository.findAll();
  }

  create(input: CreateExampleInput): Promise<ExampleItem> {
    return this.repository.create(input);
  }
}
