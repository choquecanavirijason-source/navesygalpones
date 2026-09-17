import type { IMailer } from "@/core/interfaces/client/IMailer";
import type { ILogger } from "@/core/interfaces/client/ILogger";
import type { MailMessage } from "@/core/types/client/mailer.types";
import { logger } from "@/infrastructure/logger/Logger";

/**
 * Transporte de desarrollo: registra el correo en el log y NO lo envía.
 * Sustituir por una implementación real de `IMailer` cuando se apruebe
 * el proveedor/librería de envío.
 */
export class ConsoleMailer implements IMailer {
  constructor(private readonly log: ILogger) {}

  async send(message: MailMessage): Promise<void> {
    this.log.info("Mail not sent (console transport)", {
      to: message.to,
      subject: message.subject,
    });
  }
}

export const mailer: IMailer = new ConsoleMailer(logger.child("mailer"));
