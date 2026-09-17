import type { ExampleItem } from "@/core/models/Example";
import type { CreateExampleInput } from "@/core/types/modules/example/example.types";

/** Acceso a datos de `example`. Lo implementa `infrastructure/repositories`. */
export interface IExampleRepository {
  findAll(): Promise<ExampleItem[]>;
  create(input: CreateExampleInput): Promise<ExampleItem>;
}
