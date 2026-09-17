import { z } from "zod";

import type { CreateExampleInput } from "@/core/types/modules/example/example.types";

/** El `satisfies` garantiza que el schema no se desincronice del tipo de `core`. */
export const createExampleSchema = z.object({
  name: z.string().trim().min(1).max(120),
}) satisfies z.ZodType<CreateExampleInput>;
