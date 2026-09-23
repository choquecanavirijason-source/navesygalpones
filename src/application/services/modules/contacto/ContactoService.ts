import type { ILogger } from "@/core/interfaces/client/ILogger";
import type { IMailer } from "@/core/interfaces/client/IMailer";
import type { IContactoService } from "@/core/interfaces/modules/contacto/IContactoService";
import type {
  ContactoReceipt,
  SendContactoInput,
} from "@/core/types/modules/contacto/contacto.types";

interface ContactoServiceOptions {
  /** Buzón que recibe las consultas. */
  to: string;
}

/** Etiquetas del correo interno: lo lee el equipo comercial, no el visitante. */
const FIELD_LABELS: ReadonlyArray<readonly [keyof SendContactoInput, string]> = [
  ["type", "Tipo de obra"],
  ["area", "Superficie (m²)"],
  ["name", "Nombre y apellido"],
  ["company", "Empresa"],
  ["phone", "Teléfono / WhatsApp"],
  ["city", "Localidad"],
  ["message", "Mensaje"],
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Convierte una consulta del formulario en un correo al buzón comercial.
 *
 * El transporte llega inyectado (`IMailer`), así que este servicio no sabe si se manda por
 * SMTP o si solo se registra en el log: la decisión vive en el composition root de la ruta.
 */
export class ContactoService implements IContactoService {
  constructor(
    private readonly mailer: IMailer,
    private readonly options: ContactoServiceOptions,
    private readonly log: ILogger,
  ) {}

  async send(input: SendContactoInput): Promise<ContactoReceipt> {
    // Campo trampa completo: es un bot. Se responde igual que a un envío bueno para no
    // darle pistas, pero no se manda nada.
    if (input.website?.trim()) {
      this.log.warn("Consulta descartada por el campo trampa");
      return { sent: true };
    }

    await this.mailer.send({
      to: this.options.to,
      subject: this.buildSubject(input),
      text: this.buildText(input),
      html: this.buildHtml(input),
    });

    return { sent: true };
  }

  private buildSubject(input: SendContactoInput): string {
    const detail = [input.type, input.city].filter(Boolean).join(" · ");
    return detail ? `Consulta web: ${input.name} — ${detail}` : `Consulta web: ${input.name}`;
  }

  private buildText(input: SendContactoInput): string {
    const lines = FIELD_LABELS.filter(([field]) => String(input[field] ?? "").trim() !== "").map(
      ([field, label]) => `${label}: ${String(input[field])}`,
    );

    return ["Nueva consulta desde el formulario de la web.", "", ...lines].join("\n");
  }

  private buildHtml(input: SendContactoInput): string {
    const rows = FIELD_LABELS.filter(([field]) => String(input[field] ?? "").trim() !== "")
      .map(
        ([field, label]) =>
          `<tr><th align="left" style="padding:6px 12px 6px 0;color:#6d6d6d;font-weight:600;vertical-align:top">${label}</th>` +
          `<td style="padding:6px 0;color:#2b2b2b">${escapeHtml(String(input[field])).replace(/\n/g, "<br>")}</td></tr>`,
      )
      .join("");

    return [
      '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#2b2b2b">',
      '<p style="margin:0 0 16px">Nueva consulta desde el formulario de la web.</p>',
      `<table cellpadding="0" cellspacing="0">${rows}</table>`,
      "</div>",
    ].join("");
  }
}
