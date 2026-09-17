import type { ILogger } from "@/core/interfaces/client/ILogger";
import type { LogContext, LogLevel } from "@/core/types/client/logger.types";
import { getServerConfig } from "@/config/config";

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

interface LoggerOptions {
  level: LogLevel;
  /** Salida JSON de una línea (producción, agregadores de logs). */
  json: boolean;
  scope?: string;
}

export class Logger implements ILogger {
  constructor(private readonly options: LoggerOptions) {}

  debug(message: string, context?: LogContext): void {
    this.write("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.write("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.write("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.write("error", message, context);
  }

  child(scope: string): ILogger {
    const parent = this.options.scope;
    return new Logger({ ...this.options, scope: parent ? `${parent}:${scope}` : scope });
  }

  private write(level: LogLevel, message: string, context?: LogContext): void {
    if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[this.options.level]) return;

    const { scope, json } = this.options;
    const output = console[level];

    if (json) {
      output(JSON.stringify({ time: new Date().toISOString(), level, scope, message, ...context }));
      return;
    }

    const prefix = `${level.toUpperCase()}${scope ? ` [${scope}]` : ""}`;
    if (context) output(`${prefix} ${message}`, context);
    else output(`${prefix} ${message}`);
  }
}

const isServer = typeof window === "undefined";

export const logger: ILogger = new Logger({
  level: isServer ? getServerConfig().logLevel : "warn",
  json: isServer && process.env.NODE_ENV === "production",
});
