import { env } from "@rumahkodingku-academy/env/server";
import winston from "winston";

import { SENSITIVE_KEYS } from "./redact";

// Log levels: error, warn, info, http, verbose, debug, silly
const logLevel = env.LOG_LEVEL;
const isDevelopment = env.NODE_ENV !== "production";

const redactFormat = winston.format((info) => {
  for (const key of Object.keys(info)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      info[key] = "[REDACTED]";
    }
  }
  return info;
});

// Custom format for development with colors
const devFormat = winston.format.combine(
  redactFormat(),
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

// JSON format for production
const prodFormat = winston.format.combine(
  redactFormat(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: isDevelopment ? devFormat : prodFormat,
  defaultMeta: { env: env.NODE_ENV },
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

/**
 * Create a child logger with additional context
 * Useful for adding request IDs, user IDs, or other contextual information
 *
 * @example
 * const requestLogger = createChildLogger({ requestId: 'abc123', userId: 'user456' });
 * requestLogger.info('Processing request');
 */
export function createChildLogger(bindings: Record<string, unknown>): winston.Logger {
  return logger.child(bindings);
}

/**
 * Log levels explained (npm log levels):
 * - error (0): Error messages for failures that don't stop the application
 * - warn (1): Warning messages for potentially problematic situations
 * - info (2): General information about application flow
 * - http (3): HTTP request logging
 * - verbose (4): More detailed than info
 * - debug (5): Detailed information useful during development
 * - silly (6): Most detailed logging
 *
 * @example
 * logger.info('Server started');
 * logger.info('Server started on port', { port: 3000 });
 * logger.error('Failed to process request', { err: error });
 * logger.debug('User action logged', { userId, action });
 */
export { logger };

export default logger;
