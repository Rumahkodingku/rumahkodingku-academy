import { Policy } from "@nestjs/authorization";

import type { AuthUser } from "../../auth/auth.types";

@Policy()
export class PermissionPolicy {
  has(user: AuthUser | null, permission: string): boolean {
    return user?.permissions.includes(permission) ?? false;
  }
}
