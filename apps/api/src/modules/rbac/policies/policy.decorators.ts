import type { ExecutionContext } from "@nestjs/common";
import { Can } from "@nestjs/authorization";

import { EmailVerifiedPolicy, OwnershipPolicy } from "../../auth/policies/auth.policies";
import { PermissionPolicy } from "./permission.policy";

/**
 * Typed helpers around @Can for policies whose ability signatures include a
 * second argument. The package's route-ability inference narrows these to
 * `never` in this codebase, so the ability name is passed through here once.
 */
export function RequirePermission(permission: string) {
  return Can(PermissionPolicy, "has" as never, () => [permission]);
}

export function RequireVerifiedEmail() {
  return Can(EmailVerifiedPolicy, "verified" as never);
}

export function RequireOwnership(resolver: (context: ExecutionContext) => readonly string[]) {
  return Can(OwnershipPolicy, "owns" as never, resolver);
}
