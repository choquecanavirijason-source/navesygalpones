import type { QuoteSummaryLine } from "@/presentation/helpers/quotes/request";

/**
 * PDF de la solicitud de cotización, generado en el navegador.
 *
 * `jspdf` se importa de forma dinámica dentro de `downloadQuotePdf`: pesa bastante y solo
 * hace falta cuando el cliente pulsa el botón, así que no entra en el bundle de la página.
 */

/** Colores de marca (`globals.css`) en RGB, que es lo que entiende jsPDF. */
const ORANGE: [number, number, number] = [240, 74, 0];
const GRAPHITE: [number, number, number] = [43, 43, 43];
const GRAY: [number, number, number] = [109, 109, 109];
const LIGHT: [number, number, number] = [243, 243, 243];
const RULE: [number, number, number] = [226, 226, 226];

/** A4 en milímetros. */
const PAGE = { width: 210, height: 297, margin: 16 } as const;
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2;
const LABEL_WIDTH = 58;
const VALUE_X = PAGE.margin + LABEL_WIDTH + 4;
const VALUE_WIDTH = CONTENT_WIDTH - LABEL_WIDTH - 4;
/** Debajo de esta altura ya no entra otra fila: se abre página nueva. */
const BOTTOM_LIMIT = PAGE.height - 28;

export interface QuotePdfSection {
  title: string;
  lines: readonly QuoteSummaryLine[];
}

export interface QuotePdfContent {
  /** Textos ya traducidos. */
  brand: string;
  documentTitle: string;
  requestId: string;
  date: string;
  sections: readonly QuotePdfSection[];
  emptyLabel: string;
  footer: string;
  /** Pie de página, ya traducido, para cada hoja. */
  pageLabel: (page: number, total: number) => string;
}

/** Genera el PDF y lo descarga. Lanza si `jspdf` no se puede cargar. */
export async function downloadQuotePdf(content: QuotePdfContent, filename: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  // ─── Encabezado ──────────────────────────────────────────────────────────
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, PAGE.width, 26, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(content.brand, PAGE.margin, 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(content.documentTitle.toUpperCase(), PAGE.margin, 20);

  doc.setTextColor(...ORANGE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(content.requestId, PAGE.margin, 38);

  doc.setTextColor(...GRAY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(content.date, PAGE.width - PAGE.margin, 38, { align: "right" });

  let y = 46;

  const newPage = () => {
    doc.addPage();
    doc.setFillColor(...ORANGE);
    doc.rect(0, 0, PAGE.width, 6, "F");
    y = 20;
  };

  /** Reserva `height` mm: si no entran, sigue en la página siguiente. */
  const reserve = (height: number) => {
    if (y + height > BOTTOM_LIMIT) newPage();
  };

  // ─── Secciones ───────────────────────────────────────────────────────────
  for (const section of content.sections) {
    reserve(18);

    doc.setFillColor(...LIGHT);
    doc.rect(PAGE.margin, y, CONTENT_WIDTH, 8, "F");
    doc.setTextColor(...GRAPHITE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(section.title.toUpperCase(), PAGE.margin + 3, y + 5.4);
    y += 12;

    for (const line of section.lines) {
      const value = line.value.trim() === "" ? content.emptyLabel : line.value;
      doc.setFontSize(8.5);
      const labelLines = doc.splitTextToSize(line.label.toUpperCase(), LABEL_WIDTH);
      doc.setFontSize(10);
      const valueLines = doc.splitTextToSize(value, VALUE_WIDTH);
      const height = Math.max(labelLines.length, valueLines.length) * 4.6 + 3;

      reserve(height);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...GRAY);
      doc.text(labelLines, PAGE.margin + 3, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...GRAPHITE);
      doc.text(valueLines, VALUE_X, y);

      y += height;
      doc.setDrawColor(...RULE);
      doc.setLineWidth(0.2);
      doc.line(PAGE.margin + 3, y - 2.6, PAGE.width - PAGE.margin - 3, y - 2.6);
    }

    y += 6;
  }

  // ─── Pie de página ───────────────────────────────────────────────────────
  // Se escribe al final porque recién acá se sabe cuántas hojas quedaron.
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.2);
    doc.line(PAGE.margin, PAGE.height - 18, PAGE.width - PAGE.margin, PAGE.height - 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text(content.footer, PAGE.margin, PAGE.height - 13);
    doc.text(content.pageLabel(page, total), PAGE.width - PAGE.margin, PAGE.height - 13, {
      align: "right",
    });
  }

  doc.save(filename);
}
