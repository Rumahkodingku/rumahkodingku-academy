import type { AuthUser } from "./types";

export const PERMISSIONS = {
  ADMIN_ACCESS: "admin.access",
} as const;

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  return user?.permissions.includes(permission) ?? false;
}
