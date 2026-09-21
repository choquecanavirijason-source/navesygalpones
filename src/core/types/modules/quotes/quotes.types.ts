/**
 * Contratos del formulario inteligente de cotización.
 *
 * Las diez categorías salen del documento funcional de NyG: el selector las muestra en
 * este orden y cada una abre su propio set de preguntas (ver `content/quotes.ts`).
 */
export type QuoteCategory =
  | "tinglado"
  | "galpon"
  | "nave"
  | "estructura"
  | "ampliacion"
  | "piso"
  | "movimiento"
  | "obraCivil"
  | "llaveEnMano"
  | "otro";

/** Respuesta de un campo: texto libre/opción única, o varias opciones (checkboxes). */
export type QuoteAnswer = string | string[];

/** Respuestas de las preguntas específicas de la categoría, indexadas por nombre de campo. */
export type QuoteAnswers = Record<string, QuoteAnswer>;

/** Datos comunes a todas las categorías: dónde es la obra y en qué etapa está. */
export interface QuoteContext {
  province: string;
  city: string;
  landAvailable: string;
  stage: string;
  startDate: string;
  /** Fecha límite: opcional según el documento funcional. */
  deadline: string;
}

/** Datos de contacto, que se piden al final del proceso. */
export interface QuoteContact {
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  preferredTime: string;
}

/** Solicitud completa, tal como se arma antes de enviarla. */
export interface QuoteRequestInput extends QuoteContext, QuoteContact {
  category: QuoteCategory;
  answers: QuoteAnswers;
}

/** Borrador que el formulario guarda mientras el cliente lo completa. */
export interface QuoteDraft extends QuoteContext, QuoteContact {
  category: QuoteCategory | null;
  answers: QuoteAnswers;
}
