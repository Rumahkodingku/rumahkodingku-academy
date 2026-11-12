import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { env } from "@rumahkodingku-academy/env/server";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ZodValidationPipe } from "nestjs-zod";

import { AppModule } from "./app.module";
import { csrfProtection } from "./modules/csrf/csrf";
import { startMetricsServer, stopMetricsServer } from "./infrastructure/metrics/metrics";
import { ProblemDetailsFilter } from "./common/http/problem-details.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(csrfProtection);
  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Rumah Kodingku Academy API")
    .setDescription("REST API for Rumah Kodingku Academy")
    .setVersion("1.0.0")
    .addCookieAuth("access_token")
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, swaggerDocument);
  app.use(
    "/reference",
    apiReference({
      spec: { url: "/swagger-json" },
    }),
  );

  await startMetricsServer().catch((error: unknown) => {
    console.warn("Metrics server failed to start", error);
  });

  await app.listen(env.PORT);
  console.log(`Server is running on http://localhost:${env.PORT}/api/v1`);
}

async function shutdown() {
  await stopMetricsServer();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

bootstrap();
