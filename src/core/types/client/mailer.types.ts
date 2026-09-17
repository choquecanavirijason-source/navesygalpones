export interface MailMessage {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}
