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
import { REQUEST_ID_HEADER, requestIdMiddleware } from "./common/http/request-id.middleware";
import { ProblemDetailsFilter } from "./common/http/problem-details.filter";
import { logger } from "./common/logging/logger";
import { WinstonLoggerService } from "./common/logging/winston-logger.service";
import { cookieToBearer } from "./modules/auth/auth.middleware";
import { csrfProtection, ensureCsrfSession } from "./modules/csrf/csrf";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(),
  });

  app.setGlobalPrefix("api/v1");
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.use(cookieToBearer);
  app.use(ensureCsrfSession);
  app.use(csrfProtection);

  const expressApp = app.getHttpAdapter().getInstance() as {
    set: (key: string, value: unknown) => void;
  };
  expressApp.set("trust proxy", env.TRUST_PROXY);
  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposedHeaders: [REQUEST_ID_HEADER],
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

  await app.listen(env.PORT);
  logger.info(`Server is running on http://localhost:${env.PORT}/api/v1`);
}

void bootstrap().catch((error: unknown) => {
  logger.error("Failed to start API", { error });
  process.exit(1);
});
