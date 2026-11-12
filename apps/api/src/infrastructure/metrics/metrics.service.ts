import { createServer, type Server } from "node:http";

import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { env } from "@rumahkodingku-academy/env/server";
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from "prom-client";

import { logger } from "../../common/logging/logger";

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private readonly registry = new Registry();
  private server: Server | null = null;
  private readonly prefix = env.METRICS_PREFIX.replace(/[^a-zA-Z0-9_:]/g, "_");

  readonly httpRequestsTotal = new Counter({
    name: `${this.prefix}http_requests_total`,
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [this.registry],
  });

  readonly httpRequestDuration = new Histogram({
    name: `${this.prefix}http_request_duration_seconds`,
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    registers: [this.registry],
  });

  readonly activeConnections = new Gauge({
    name: `${this.prefix}active_connections`,
    help: "Number of active connections",
    registers: [this.registry],
  });

  readonly dbQueryDuration = new Histogram({
    name: `${this.prefix}db_query_duration_seconds`,
    help: "Database query duration in seconds",
    labelNames: ["operation", "table"],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [this.registry],
  });

  readonly errorsTotal = new Counter({
    name: `${this.prefix}errors_total`,
    help: "Total number of errors",
    labelNames: ["type", "operation"],
    registers: [this.registry],
  });

  constructor() {
    this.registry.setDefaultLabels({
      app: "rumahkodingku-academy",
      environment: env.NODE_ENV,
    });

    collectDefaultMetrics({
      register: this.registry,
      prefix: this.prefix,
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.startServer();
    } catch (error) {
      logger.warn("Metrics server failed to start", { error });
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.stopServer();
  }

  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  get contentType(): string {
    return this.registry.contentType;
  }

  private startServer(): Promise<void> {
    this.server = createServer(async (request, response) => {
      if (request.url === env.METRICS_PATH) {
        try {
          response.setHeader("Content-Type", this.registry.contentType);
          response.end(await this.registry.metrics());
        } catch {
          response.statusCode = 500;
          response.end("Error collecting metrics");
        }
        return;
      }

      if (request.url === "/health") {
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ status: "healthy" }));
        return;
      }

      response.statusCode = 404;
      response.end("Not found");
    });

    return new Promise((resolve, reject) => {
      this.server?.once("error", reject);
      this.server?.listen(env.METRICS_PORT, () => {
        logger.info(`Metrics server running on port ${env.METRICS_PORT}`);
        resolve();
      });
    });
  }

  private stopServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }

      this.server.close((error) => {
        this.server = null;
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}
