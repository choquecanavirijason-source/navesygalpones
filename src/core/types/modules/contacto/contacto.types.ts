import type { ContactoLead } from "@/core/models/Contacto";

/**
 * Lo que viaja al endpoint. `website` es un campo trampa: está oculto en el formulario, así
 * que una persona nunca lo completa y un bot que rellena todo sí. Si viene con texto, la
 * consulta se descarta.
 */
export interface SendContactoInput extends ContactoLead {
  website?: string;
}

/** Acuse de recibo. No se guarda nada: solo confirma que el correo salió. */
export interface ContactoReceipt {
  sent: true;
}
