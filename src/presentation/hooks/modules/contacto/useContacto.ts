import useSWRMutation from "swr/mutation";

import type { IContactoService } from "@/core/interfaces/modules/contacto/IContactoService";
import type {
  ContactoReceipt,
  SendContactoInput,
} from "@/core/types/modules/contacto/contacto.types";
import type { AppError } from "@/application/errors/AppError";
import { ContactoClientService } from "@/application/services/client/contacto/ContactoClientService";
import { apiLocal } from "@/infrastructure/http/clients/apiLocal";

/** Composition root del lado cliente para el formulario de contacto. */
const contactoService: IContactoService = new ContactoClientService(apiLocal);

export const contactoKeys = {
  send: "contacto:send",
} as const;

/** Envío de la consulta. Es una escritura, así que va con `useSWRMutation`, no con `useSWR`. */
export function useSendContacto() {
  return useSWRMutation<ContactoReceipt, AppError, string, SendContactoInput>(
    contactoKeys.send,
    (_key, { arg }) => contactoService.send(arg),
  );
}
