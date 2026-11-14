import { Module } from "@nestjs/common";
import { AuthenticationModule, type Duration } from "@nestjs/authentication";
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
      refreshToken: {
        ttl: env.JWT_REFRESH_TTL as Duration,
        absoluteTtl: env.JWT_REFRESH_ABSOLUTE_TTL as Duration,
      },
      emailVerification: {
        url: `${env.WEB_APP_URL}/verify-email`,
        ttl: "24h",
      },
      password:
        env.NODE_ENV === "test"
          ? {
              logN: 10,
            }
          : {},
      globalGuard: true,
      allowInMemoryStorage: env.NODE_ENV !== "production",
    }),
    AuthorizationModule.forRoot({
      globalGuard: true,
    }),
  ],
})
export class SecurityModule {}
