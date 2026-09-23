import type { IHttpClient } from "@/core/interfaces/client/IHttpClient";
import type { IContactoService } from "@/core/interfaces/modules/contacto/IContactoService";
import type { ApiSuccessResponse } from "@/core/types/api/api.types";
import type {
  ContactoReceipt,
  SendContactoInput,
} from "@/core/types/modules/contacto/contacto.types";
import { LOCAL_API_ROUTES } from "@/config/constants";

/**
 * Servicio de navegador del formulario de contacto: llama a la API interna
 * (`/api/contacto`) con el `IHttpClient` inyectado y desempaqueta el sobre `ApiResponse`.
 */
export class ContactoClientService implements IContactoService {
  constructor(private readonly http: IHttpClient) {}

  async send(input: SendContactoInput): Promise<ContactoReceipt> {
    const response = await this.http.post<ApiSuccessResponse<ContactoReceipt>, SendContactoInput>(
      LOCAL_API_ROUTES.contacto,
      input,
    );

    return response.data;
  }
}
