import type { z } from "zod";

import type { ValidationIssue } from "@/core/types/api/api.types";
import { AppError } from "@/application/errors/AppError";

export function toValidationIssues(error: z.ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.map(String).join("."),
    message: issue.message,
  }));
}

/** Valida `input` contra `schema`; si falla lanza `AppError` (VALIDATION_ERROR, 422). */
export function parseOrThrow<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);
  if (!result.success) throw AppError.validation(toValidationIssues(result.error));
  return result.data;
}

/** Lee el cuerpo JSON de una petición y lo valida. JSON mal formado → BAD_REQUEST (400). */
export async function parseJsonBody<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    throw AppError.badRequest("Invalid JSON body", error);
  }

  return parseOrThrow(schema, body);
}
