import { Inject, Injectable, type OnModuleDestroy } from "@nestjs/common";
import { AuthenticationEvents, type AuthenticationEvent } from "@nestjs/authentication";
import { AuditLog } from "@rumahkodingku-academy/db";
import type { Subscription } from "rxjs";
import { DataSource } from "typeorm";
import { v7 as uuidv7 } from "uuid";

import { logger } from "../../../common/logging/logger";
import { DATA_SOURCE } from "../../../infrastructure/database/database.module";

@Injectable()
export class AuthAuditListener implements OnModuleDestroy {
  private subscription?: Subscription;

  constructor(
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    events: AuthenticationEvents,
  ) {
    this.subscription = events.events$.subscribe((event) => {
      void this.record(event).catch((error: unknown) => {
        logger.error("Failed to record auth audit event", {
          error: error instanceof Error ? error.message : "unknown error",
        });
      });
    });
  }

  onModuleDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private async record(event: AuthenticationEvent): Promise<void> {
    const actorUserId = "userId" in event && typeof event.userId === "string" ? event.userId : null;

    await this.dataSource.getRepository(AuditLog).insert({
      id: uuidv7(),
      actorUserId,
      action: `auth.${event.type.replaceAll("-", "_")}`,
      resourceType: "auth",
      resourceId: actorUserId,
      afterMetadata: this.safeMetadata(event) as never,
    });
  }

  private safeMetadata(event: AuthenticationEvent): Record<string, unknown> {
    switch (event.type) {
      case "sign-in":
        return {
          method: event.method ?? null,
          mfa: event.mfa ?? null,
          sessionId: event.sessionId ?? null,
          tokenFamilyId: event.tokenFamilyId ?? null,
        };
      case "sign-out":
        return {
          sessionId: event.sessionId ?? null,
          tokenFamilyId: event.tokenFamilyId ?? null,
          everywhere: event.everywhere ?? false,
        };
      case "password-reset-requested":
        return { requested: true };
      case "email-verified":
        return { verified: true };
      case "refresh-token-reused":
        return { tokenFamilyId: event.tokenFamilyId };
      default:
        return {};
    }
  }
}
