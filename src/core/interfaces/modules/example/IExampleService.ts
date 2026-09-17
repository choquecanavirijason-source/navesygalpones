import type { ExampleItem } from "@/core/models/Example";
import type { CreateExampleInput } from "@/core/types/modules/example/example.types";

/**
 * Casos de uso de `example`. Lo implementan dos servicios con el mismo contrato:
 * - `application/services/modules` (servidor → repositorio → backend)
 * - `application/services/client`  (navegador → `/api`)
 */
export interface IExampleService {
  list(): Promise<ExampleItem[]>;
  create(input: CreateExampleInput): Promise<ExampleItem>;
}
