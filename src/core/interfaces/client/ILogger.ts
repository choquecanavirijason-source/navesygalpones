import type { LogContext } from "@/core/types/client/logger.types";

export interface ILogger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  /** Devuelve un logger que antepone `scope` a cada mensaje. */
  child(scope: string): ILogger;
}
