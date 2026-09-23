import { z } from "zod";

import { HTTP_TIMEOUT_MS } from "@/config/constants";
import type { LogLevel } from "@/core/types/client/logger.types";

/** Trata `VAR=` (cadena vacía) igual que una variable no definida. */
const emptyToUndefined = (value: unknown): unknown => (value === "" ? undefined : value);

// ─── Configuración pública (segura para el navegador) ──────────────────────

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.url().default("http://localhost:3000")),
});

const publicEnv = publicEnvSchema.parse({
  // Next.js solo inyecta variables NEXT_PUBLIC_* referenciadas de forma literal.
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

export const publicConfig = {
  siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, ""),
} as const;

// ─── Configuración de servidor (nunca llega al navegador) ─────────────────

const serverEnvSchema = z.object({
  API_BASE_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  API_TIMEOUT_MS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(HTTP_TIMEOUT_MS),
  ),
  API_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  LOG_LEVEL: z.preprocess(
    emptyToUndefined,
    z.enum(["debug", "info", "warn", "error"]).default("info"),
  ),
  // Correo saliente (formulario de contacto). Ver `.env.example`.
  SMTP_HOST: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PORT: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().default(465)),
  SMTP_USER: z.preprocess(emptyToUndefined, z.string().optional()),
  SMTP_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional()),
  MAIL_FROM: z.preprocess(emptyToUndefined, z.string().optional()),
  CONTACT_TO: z.preprocess(emptyToUndefined, z.email().default("info@nygestructuras.com")),
});

export interface SmtpConfig {
  host: string;
  /** El 465 abre TLS directo; el 587 lo negocia con STARTTLS. */
  port: number;
  secure: boolean;
  user: string;
  password: string;
  /** Remitente del mensaje. Por defecto, la misma casilla autenticada. */
  from: string;
}

export interface ServerConfig {
  apiBaseUrl: string;
  apiTimeoutMs: number;
  apiToken: string | undefined;
  logLevel: LogLevel;
  /** `undefined` mientras falten credenciales: sin ellas no hay transporte real de correo. */
  smtp: SmtpConfig | undefined;
  /** Buzón que recibe las consultas del formulario. */
  contactTo: string;
}

let serverConfig: ServerConfig | undefined;

/** Lee y valida las variables de servidor una sola vez. Lanza si se invoca en el navegador. */
export function getServerConfig(): ServerConfig {
  if (typeof window !== "undefined") {
    throw new Error("getServerConfig() solo puede ejecutarse en el servidor.");
  }

  if (!serverConfig) {
    const env = serverEnvSchema.parse(process.env);
    // Las tres juntas o ninguna: un transporte a medio configurar fallaría en cada envío.
    const hasSmtp = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASSWORD);

    serverConfig = {
      apiBaseUrl: env.API_BASE_URL?.replace(/\/+$/, "") ?? "",
      apiTimeoutMs: env.API_TIMEOUT_MS,
      apiToken: env.API_TOKEN,
      logLevel: env.LOG_LEVEL,
      smtp: hasSmtp
        ? {
            host: env.SMTP_HOST as string,
            port: env.SMTP_PORT,
            secure: env.SMTP_PORT === 465,
            user: env.SMTP_USER as string,
            password: env.SMTP_PASSWORD as string,
            from: env.MAIL_FROM ?? (env.SMTP_USER as string),
          }
        : undefined,
      contactTo: env.CONTACT_TO,
    };
  }

  return serverConfig;
}
