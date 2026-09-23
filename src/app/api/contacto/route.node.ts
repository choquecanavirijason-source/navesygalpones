import type { IMailer } from "@/core/interfaces/client/IMailer";
import type { ApiSuccessResponse } from "@/core/types/api/api.types";
import type { ContactoReceipt } from "@/core/types/modules/contacto/contacto.types";
import { getServerConfig } from "@/config/config";
import { AppError } from "@/application/errors/AppError";
import { ErrorHandler } from "@/application/errors/ErrorHandler";
import { ContactoService } from "@/application/services/modules/contacto/ContactoService";
import { logger } from "@/infrastructure/logger/Logger";
import { ConsoleMailer } from "@/infrastructure/mailer/ConsoleMailer";
import { SmtpMailer } from "@/infrastructure/mailer/SmtpMailer";
import { parseJsonBody } from "@/infrastructure/validators/common/validate";
import { sendContactoSchema } from "@/infrastructure/validators/contacto/contacto.schema";

/*
 * Formulario de contacto de la home. Flujo:
 * hook (SWR) → ContactoClientService → apiLocal → [esta ruta]
 *   → Zod → ContactoService → IMailer (SMTP) → buzón comercial
 *
 * Composition root de servidor: el único lugar que decide qué transporte de correo se usa.
 */

// nodemailer abre sockets TCP: necesita el runtime de Node, no el edge.
export const runtime = "nodejs";

const log = logger.child("api:contacto");
const { smtp, contactTo } = getServerConfig();

/** Sin credenciales, en desarrollo el correo solo se registra en el log. */
const mailer: IMailer = smtp ? new SmtpMailer(smtp, log) : new ConsoleMailer(log);
const contactoService = new ContactoService(mailer, { to: contactTo }, log);

function handleError(error: unknown): Response {
  const appError = ErrorHandler.normalize(error);
  // No se registra `cause`: el error de SMTP puede arrastrar las credenciales.
  if (appError.isServerError) {
    log.error(appError.message, { code: appError.code, status: appError.status });
  }
  return ErrorHandler.toResponse(appError);
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!smtp && process.env.NODE_ENV === "production") {
      // Mejor un error visible que aceptar la consulta y perderla en silencio.
      throw AppError.serviceUnavailable("Correo saliente sin configurar");
    }

    const input = await parseJsonBody(request, sendContactoSchema);
    const data = await contactoService.send(input);

    return Response.json({ success: true, data } satisfies ApiSuccessResponse<ContactoReceipt>, {
      status: 201,
    });
  } catch (error) {
    return handleError(error);
  }
}
