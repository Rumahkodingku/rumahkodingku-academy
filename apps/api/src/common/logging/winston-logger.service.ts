import { Injectable, type LoggerService } from "@nestjs/common";

import { logger } from "./logger";

@Injectable()
export class WinstonLoggerService implements LoggerService {
  log(message: unknown, ...optionalParams: unknown[]): void {
    logger.info(this.toMessage(message), this.toMeta(optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    logger.error(this.toMessage(message), this.toMeta(optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    logger.warn(this.toMessage(message), this.toMeta(optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    logger.debug(this.toMessage(message), this.toMeta(optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    logger.verbose(this.toMessage(message), this.toMeta(optionalParams));
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    logger.error(this.toMessage(message), this.toMeta(optionalParams));
  }

  private toMessage(message: unknown): string {
    return typeof message === "string" ? message : JSON.stringify(message);
  }

  private toMeta(optionalParams: unknown[]): Record<string, unknown> | undefined {
    return optionalParams.length > 0 ? { context: optionalParams } : undefined;
  }
}
