import { z } from "zod";

import type { QuoteFieldConfig } from "@/content/quotes";
import { QUOTE_CATEGORIES } from "@/content/quotes";
import type {
  QuoteAnswer,
  QuoteAnswers,
  QuoteRequestInput,
} from "@/core/types/modules/quotes/quotes.types";

/** Código de error de un campo. La UI lo traduce con `Quotes.validation.<código>`. */
export type QuoteFieldErrorCode = "required" | "email" | "phone" | "number";

/** Errores por nombre de campo. Vacío = el paso es válido. */
export type QuoteFieldErrors = Record<string, QuoteFieldErrorCode>;

const emailSchema = z.email();
/** Números, espacios y los separadores habituales; al menos 6 dígitos. */
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[\d\s().-]{6,}$/)
  .refine((value) => (value.match(/\d/g) ?? []).length >= 6);
const positiveNumberSchema = z.coerce.number().positive().finite();

/** Campos con formato propio, por nombre. Solo se validan si tienen valor. */
const FIELD_FORMATS: Record<string, z.ZodType> = {
  email: emailSchema,
  whatsapp: phoneSchema,
};

const isEmpty = (value: QuoteAnswer | undefined) =>
  value === undefined || (Array.isArray(value) ? value.length === 0 : value.trim() === "");

/**
 * Valida un paso contra su configuración de campos y devuelve un código de error por campo.
 * Se usa en el navegador para habilitar el paso siguiente; el mismo criterio sirve del lado
 * del servidor cuando el envío deje de ser solo por WhatsApp (ver `quoteRequestSchema`).
 */
export function validateQuoteFields(
  fields: readonly QuoteFieldConfig[],
  values: Readonly<Record<string, QuoteAnswer | undefined>>,
): QuoteFieldErrors {
  const errors: QuoteFieldErrors = {};

  for (const field of fields) {
    const value = values[field.name];

    if (isEmpty(value)) {
      if (field.required) errors[field.name] = "required";
      continue;
    }

    if (Array.isArray(value)) continue;

    if (field.type === "number" && !positiveNumberSchema.safeParse(value).success) {
      errors[field.name] = "number";
      continue;
    }

    const format = FIELD_FORMATS[field.name];
    if (format && !format.safeParse(value).success) {
      errors[field.name] = field.name === "email" ? "email" : "phone";
    }
  }

  return errors;
}

const answersSchema: z.ZodType<QuoteAnswers> = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())]),
);

/**
 * Solicitud completa. Hoy el envío es por WhatsApp y no hay backend, pero el schema es el
 * contrato único: una route handler futura valida con esto sin duplicar reglas.
 */
export const quoteRequestSchema = z.object({
  category: z.enum(QUOTE_CATEGORIES),
  answers: answersSchema,
  province: z.string().trim().min(1),
  city: z.string().trim().min(1),
  landAvailable: z.string().trim().min(1),
  stage: z.string().trim().min(1),
  startDate: z.string().trim().min(1),
  deadline: z.string().trim(),
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120),
  whatsapp: phoneSchema,
  email: emailSchema.max(160),
  preferredTime: z.string().trim(),
}) satisfies z.ZodType<QuoteRequestInput>;
