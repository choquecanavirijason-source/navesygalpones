import type {
  ContactoReceipt,
  SendContactoInput,
} from "@/core/types/modules/contacto/contacto.types";

/**
 * Contrato del envío de consultas. Lo implementan las dos puntas: el servicio de servidor
 * (que manda el correo) y el de navegador (que llama al endpoint interno).
 */
export interface IContactoService {
  send(input: SendContactoInput): Promise<ContactoReceipt>;
}
