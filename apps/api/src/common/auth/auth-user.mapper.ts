import type { AccessSnapshot } from "../../modules/rbac/rbac.types";
import type { AuthUser } from "../../modules/auth/auth.types";
import type { User } from "@rumahkodingku-academy/db";

export function toAuthUser(user: User, access: AccessSnapshot): AuthUser | null {
  if (!user.profile) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt),
    status: user.status,
    roles: access.roles,
    permissions: access.permissions,
    profile: {
      displayName: user.profile.displayName,
      fullName: user.profile.fullName ?? null,
      username: user.profile.username ?? null,
      bio: user.profile.bio ?? null,
      headline: user.profile.headline ?? null,
      avatarUrl: user.profile.avatarStorageKey ? "/api/v1/users/me/avatar" : null,
      phone: user.profile.phone ?? null,
      countryCode: user.profile.countryCode ?? null,
      city: user.profile.city ?? null,
      timezone: user.profile.timezone ?? null,
      locale: user.profile.locale,
      websiteUrl: user.profile.websiteUrl ?? null,
      githubUrl: user.profile.githubUrl ?? null,
      linkedinUrl: user.profile.linkedinUrl ?? null,
      xUrl: user.profile.xUrl ?? null,
      instagramUrl: user.profile.instagramUrl ?? null,
      emailNotifications: user.profile.emailNotifications,
      inAppNotifications: user.profile.inAppNotifications,
    },
  };
}
