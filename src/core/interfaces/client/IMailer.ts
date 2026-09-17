import type { MailMessage } from "@/core/types/client/mailer.types";

export interface IMailer {
  send(message: MailMessage): Promise<void>;
}
