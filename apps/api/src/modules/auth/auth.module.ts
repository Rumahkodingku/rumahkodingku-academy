import { Module } from "@nestjs/common";

import { AppMailModule } from "../../infrastructure/mail/mail.module";
import { AppStorageModule } from "../../infrastructure/storage/storage.module";
import { PermissionPolicy } from "../rbac/policies/permission.policy";
import { RbacModule } from "../rbac/rbac.module";
import { AuthController } from "./auth.controller";
import { AuthMailService } from "./auth-mail.service";
import { AuthRateLimitGuard } from "./auth-rate-limit.guard";
import { AuthRateLimitService } from "./auth-rate-limit.service";
import { AuthService } from "./auth.service";
import { AvatarService } from "./avatar.service";
import { AuthAuditListener } from "./providers/auth-audit.listener";
import { EmailVerificationHandlerImpl } from "./providers/email-verification.handler";
import { JwtAuthProvider } from "./providers/jwt-auth.provider";
import { EmailVerifiedPolicy, OwnershipPolicy } from "./policies/auth.policies";
import { AuthUsersRepository } from "./repositories/auth-users.repository";
import { UserProfileRepository } from "./repositories/user-profile.repository";
import { TypeOrmEmailTokenStore } from "./stores/typeorm-email-token.store";
import { TypeOrmRefreshTokenStore } from "./stores/typeorm-refresh-token.store";

@Module({
  imports: [RbacModule, AppMailModule, AppStorageModule],
  controllers: [AuthController],
  providers: [
    AuthUsersRepository,
    UserProfileRepository,
    TypeOrmRefreshTokenStore,
    TypeOrmEmailTokenStore,
    AuthMailService,
    AuthRateLimitService,
    AuthRateLimitGuard,
    AuthService,
    AvatarService,
    JwtAuthProvider,
    EmailVerificationHandlerImpl,
    AuthAuditListener,
    PermissionPolicy,
    EmailVerifiedPolicy,
    OwnershipPolicy,
  ],
  exports: [AuthService, PermissionPolicy, EmailVerifiedPolicy, OwnershipPolicy],
})
export class AuthModule {}
