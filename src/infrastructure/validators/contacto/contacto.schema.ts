import { z } from "zod";

import type { SendContactoInput } from "@/core/types/modules/contacto/contacto.types";

/** Números, espacios y separadores habituales; al menos 6 dígitos. */
const phoneSchema = z
  .string()
  .trim()
  .min(6)
  .max(40)
  .refine((value) => (value.match(/\d/g) ?? []).length >= 6, "Teléfono incompleto");

/**
 * Lo que acepta `/api/contacto`. El mismo schema vale para validar en el navegador antes de
 * enviar: `presentation` puede importar validadores.
 *
 * Obligatorios solo nombre y teléfono, que son los que el formulario marca como tales; el
 * resto llega vacío si el visitante no lo completó.
 */
export const sendContactoSchema = z.object({
  type: z.string().trim().max(80).default(""),
  area: z.string().trim().max(40).default(""),
  name: z.string().trim().min(1).max(120),
  city: z.string().trim().max(120).default(""),
  company: z.string().trim().max(120).default(""),
  phone: phoneSchema,
  message: z.string().trim().max(2000).default(""),
  // Campo trampa: llega vacío desde el formulario real.
  website: z.string().trim().max(200).optional(),
}) satisfies z.ZodType<SendContactoInput>;
