import type { QuoteCategory } from "@/core/types/modules/quotes/quotes.types";

/**
 * Configuración estructural del formulario de cotización: qué categorías existen y qué
 * preguntas abre cada una. El texto vive en `messages/*.json` (namespace `Quotes`):
 * `Quotes.categories.<categoría>` y `Quotes.fields.<campo>`.
 *
 * Las preguntas por categoría salen del documento funcional de NyG (sección 4).
 */

/** Orden del selector del paso 1. */
export const QUOTE_CATEGORIES = [
  "tinglado",
  "galpon",
  "nave",
  "estructura",
  "ampliacion",
  "piso",
  "movimiento",
  "obraCivil",
  "llaveEnMano",
  "otro",
] as const satisfies readonly QuoteCategory[];

/**
 * Listas de opciones compartidas. Se repiten en muchas preguntas, así que viven una sola
 * vez: el texto está en `Quotes.options.<set>.<opción>`.
 */
export const QUOTE_OPTION_SETS = {
  yesNoTbd: ["yes", "no", "tbd"],
  yesNoProgress: ["yes", "no", "progress"],
  roof: ["sheet", "insulated", "tbd"],
  enclosure: ["sheet", "masonry", "mixed", "tbd"],
  scope: ["fabrication", "assembly", "both", "tbd"],
  land: ["ready", "leveling", "raw", "tbd"],
  newExisting: ["new", "existing", "tbd"],
  earthwork: ["fill", "excavation", "both", "tbd"],
  siteStatus: ["notStarted", "inProgress", "tbd"],
  stage: ["idea", "preliminary", "defined", "ready"],
  start: ["asap", "months1to3", "months3to6", "later"],
  contactTime: ["morning", "afternoon", "any"],
  turnkey: [
    "project",
    "soil",
    "foundations",
    "structure",
    "roof",
    "enclosures",
    "floor",
    "masonry",
    "installations",
    "extras",
  ],
} as const;

export type QuoteOptionSet = keyof typeof QUOTE_OPTION_SETS;

export type QuoteFieldType = "text" | "number" | "textarea" | "select" | "checkboxes";

export interface QuoteFieldConfig {
  /** Clave del campo: indexa el estado y el texto en `Quotes.fields.<name>`. */
  readonly name: string;
  readonly type: QuoteFieldType;
  /** Obligatorio para avanzar de paso. */
  readonly required?: boolean;
  /** Lista de opciones para `select` y `checkboxes`. */
  readonly options?: QuoteOptionSet;
  /** Sufijo visual del control numérico. */
  readonly unit?: "m" | "m2";
  /** Ocupa las dos columnas de la grilla. */
  readonly wide?: boolean;
}

/** Medidas: cuando una categoría tiene ancho y largo, la superficie se calcula sola. */
const DIMENSIONS = [
  { name: "width", type: "number", required: true, unit: "m" },
  { name: "length", type: "number", required: true, unit: "m" },
  { name: "height", type: "number", unit: "m" },
  { name: "area", type: "number", unit: "m2" },
] as const satisfies readonly QuoteFieldConfig[];

/** Preguntas de galpón y nave: el documento las trata como una sola categoría. */
const ENCLOSED_BUILDING = [
  ...DIMENSIONS,
  { name: "usage", type: "text", required: true },
  { name: "enclosures", type: "select", options: "enclosure" },
  { name: "masonry", type: "select", options: "yesNoTbd" },
  { name: "insulation", type: "select", options: "yesNoTbd" },
  { name: "gates", type: "text" },
  { name: "industrialFloor", type: "select", options: "yesNoTbd" },
  { name: "officesBathrooms", type: "select", options: "yesNoTbd" },
  { name: "docks", type: "select", options: "yesNoTbd" },
  { name: "installations", type: "textarea", wide: true },
] as const satisfies readonly QuoteFieldConfig[];

/** Preguntas específicas por categoría (documento funcional, sección 4). */
export const QUOTE_CATEGORY_FIELDS = {
  tinglado: [
    ...DIMENSIONS,
    { name: "usage", type: "text", required: true },
    { name: "roofType", type: "select", options: "roof" },
    { name: "insulation", type: "select", options: "yesNoTbd" },
    { name: "industrialFloor", type: "select", options: "yesNoTbd" },
  ],
  galpon: ENCLOSED_BUILDING,
  nave: ENCLOSED_BUILDING,
  estructura: [
    ...DIMENSIONS,
    { name: "purpose", type: "text", required: true },
    { name: "hasPlans", type: "select", options: "yesNoProgress" },
    { name: "structureType", type: "text" },
    { name: "scope", type: "select", options: "scope" },
  ],
  ampliacion: [
    { name: "currentMeasures", type: "text", required: true, wide: true },
    ...DIMENSIONS,
    { name: "usage", type: "text", required: true },
    { name: "hasPlans", type: "select", options: "yesNoProgress" },
    { name: "operationalContinuity", type: "select", options: "yesNoTbd" },
    { name: "interferences", type: "textarea", wide: true },
  ],
  piso: [
    { name: "area", type: "number", required: true, unit: "m2" },
    { name: "usage", type: "text", required: true },
    { name: "loads", type: "text" },
    { name: "landCondition", type: "select", options: "land" },
    { name: "finish", type: "text" },
    { name: "newOrExisting", type: "select", options: "newExisting" },
  ],
  movimiento: [
    { name: "area", type: "number", required: true, unit: "m2" },
    { name: "objective", type: "text", required: true },
    { name: "earthwork", type: "select", options: "earthwork" },
    { name: "slopes", type: "text" },
    { name: "equipmentAccess", type: "select", options: "yesNoTbd" },
    { name: "currentState", type: "textarea", wide: true },
  ],
  obraCivil: [
    { name: "workItems", type: "textarea", required: true, wide: true },
    { name: "quantities", type: "text" },
    { name: "hasPlans", type: "select", options: "yesNoProgress" },
    { name: "siteStatus", type: "select", options: "siteStatus" },
  ],
  llaveEnMano: [
    ...DIMENSIONS,
    { name: "usage", type: "text", required: true },
    { name: "turnkeyScope", type: "checkboxes", options: "turnkey", required: true, wide: true },
  ],
  otro: [
    { name: "description", type: "textarea", required: true, wide: true },
    { name: "width", type: "number", unit: "m" },
    { name: "length", type: "number", unit: "m" },
    { name: "height", type: "number", unit: "m" },
    { name: "area", type: "number", unit: "m2" },
  ],
} as const satisfies Record<QuoteCategory, readonly QuoteFieldConfig[]>;

/** Ubicación y etapa del proyecto: se piden igual para todas las categorías. */
export const QUOTE_CONTEXT_FIELDS = [
  { name: "province", type: "select", required: true },
  { name: "city", type: "text", required: true },
  { name: "landAvailable", type: "select", options: "yesNoProgress", required: true },
  { name: "stage", type: "select", options: "stage", required: true },
  { name: "startDate", type: "select", options: "start", required: true },
  { name: "deadline", type: "text" },
] as const satisfies readonly QuoteFieldConfig[];

/** Datos de contacto: van al final del proceso, cuando el cliente ya definió la obra. */
export const QUOTE_CONTACT_FIELDS = [
  { name: "name", type: "text", required: true },
  { name: "company", type: "text" },
  { name: "whatsapp", type: "text", required: true },
  { name: "email", type: "text", required: true },
  { name: "preferredTime", type: "select", options: "contactTime" },
] as const satisfies readonly QuoteFieldConfig[];

/** Provincias argentinas: nombres propios, no se traducen. */
export const AR_PROVINCES = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
] as const;
