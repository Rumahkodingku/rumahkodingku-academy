import { Policy } from "@nestjs/authorization";

import type { AuthUser } from "../auth.types";

@Policy()
export class EmailVerifiedPolicy {
  verified(user: AuthUser | null): boolean {
    return user?.emailVerified === true;
  }
}

@Policy()
export class OwnershipPolicy {
  owns(user: AuthUser | null, ownerId: string): boolean {
    return user?.id === ownerId;
  }
}
