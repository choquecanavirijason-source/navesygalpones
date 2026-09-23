import nodemailer, { type Transporter } from "nodemailer";

import type { ILogger } from "@/core/interfaces/client/ILogger";
import type { IMailer } from "@/core/interfaces/client/IMailer";
import type { MailMessage } from "@/core/types/client/mailer.types";
import type { SmtpConfig } from "@/config/config";
import { AppError } from "@/application/errors/AppError";
import { ERROR_CODES } from "@/application/errors/errorCodes";

/**
 * Transporte real de correo por SMTP autenticado (Hostinger, Gmail o cualquier otro:
 * el servidor sale de la configuración, no del código).
 *
 * El `Transporter` se crea en el primer envío y se reutiliza: nodemailer mantiene el pool de
 * conexiones, y crearlo al importar el módulo abriría sockets aunque nadie use el formulario.
 */
export class SmtpMailer implements IMailer {
  private transporter: Transporter | undefined;

  constructor(
    private readonly config: SmtpConfig,
    private readonly log: ILogger,
  ) {}

  async send(message: MailMessage): Promise<void> {
    try {
      await this.transport().sendMail({
        from: this.config.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
        replyTo: message.replyTo,
      });

      this.log.info("Mail sent", { to: message.to, subject: message.subject });
    } catch (error) {
      // El error de SMTP puede traer credenciales en la traza: no se propaga como mensaje.
      this.log.error("SMTP send failed", { host: this.config.host, port: this.config.port });
      throw new AppError({
        code: ERROR_CODES.SERVICE_UNAVAILABLE,
        message: "No se pudo enviar el correo",
        cause: error,
      });
    }
  }

  private transport(): Transporter {
    this.transporter ??= nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: { user: this.config.user, pass: this.config.password },
    });

    return this.transporter;
  }
}
