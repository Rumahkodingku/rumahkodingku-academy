import { Module } from "@nestjs/common";
import { AuthenticationModule } from "@nestjs/authentication";
import { AuthorizationModule } from "@nestjs/authorization";
import { env } from "@rumahkodingku-academy/env/server";

import { assertProductionSecrets } from "../../config/security.config";

assertProductionSecrets(env);

@Module({
  imports: [
    AuthenticationModule.forRoot({
      accessToken: {
        key: env.JWT_SECRET,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        ttl: env.JWT_TTL,
      },
      allowInMemoryStorage: env.NODE_ENV !== "production",
      globalGuard: false,
    }),
    AuthorizationModule.forRoot({
      globalGuard: false,
    }),
  ],
})
export class SecurityModule {}
