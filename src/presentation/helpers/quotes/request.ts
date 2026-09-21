/** Utilidades del formulario de cotización que no dependen de React. */

/** Sufijo visible de los campos con unidad (`QuoteFieldConfig.unit`). */
export const UNIT_LABEL = { m: "m", m2: "m²" } as const;

/** Una línea del resumen: etiqueta ya traducida + valor mostrable. */
export interface QuoteSummaryLine {
  label: string;
  value: string;
}

/**
 * ID de solicitud con el formato del documento funcional (`NYG-000124`).
 *
 * Al no haber backend, el número sale del reloj del navegador: sirve como referencia para
 * la conversación de WhatsApp, no como secuencia. Cuando exista la API, el ID lo emite el
 * servidor y esta función desaparece.
 */
export function buildRequestId(now: number = Date.now()): string {
  return `NYG-${String(now % 1_000_000).padStart(6, "0")}`;
}

/** Arma el mensaje de WhatsApp: saludo, ID, una línea por dato cargado y cierre. */
export function buildQuoteMessage({
  intro,
  outro,
  idLine,
  lines,
}: {
  intro: string;
  outro: string;
  idLine: string;
  lines: readonly QuoteSummaryLine[];
}): string {
  const body = lines
    .filter(({ value }) => value.trim() !== "")
    .map(({ label, value }) => `• ${label}: ${value}`)
    .join("\n");

  return [intro, "", idLine, "", body, "", outro].join("\n");
}

/** Superficie a partir de ancho y largo. Devuelve "" si falta alguno o no son números. */
export function computeArea(width: string, length: string): string {
  const w = Number(width);
  const l = Number(length);
  if (!width.trim() || !length.trim() || !Number.isFinite(w) || !Number.isFinite(l)) return "";
  if (w <= 0 || l <= 0) return "";
  return String(Math.round(w * l * 100) / 100);
}
