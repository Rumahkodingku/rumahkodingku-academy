import { Injectable } from "@nestjs/common";
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from "@nestjs/authentication";
import { UserStatus } from "@rumahkodingku-academy/db";

import { RbacService } from "../../rbac/rbac.service";
import { AuthUsersRepository } from "../repositories/auth-users.repository";
import { toAuthUser } from "../auth.mapper";
import type { AuthUser } from "../auth.types";

@Injectable()
export class JwtAuthProvider extends JwtBearerProvider<AuthUser> {
  constructor(
    private readonly users: AuthUsersRepository,
    private readonly rbac: RbacService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  protected async validate(claims: JwtClaims): Promise<AuthUser | null> {
    const userId = claims.sub;

    if (!userId) {
      return null;
    }

    const user = await this.users.findById(userId);

    if (!user || user.status !== UserStatus.Active) {
      return null;
    }

    const access = await this.rbac.getAccess(user.id);
    return toAuthUser(user, access);
  }
}
