import type { User, UserProfile, UserStatus } from "@rumahkodingku-academy/db";

import type { AccessSnapshot } from "../rbac/rbac.types";

export type AuthUserProfile = {
  displayName: string;
  fullName: string | null;
  username: string | null;
  bio: string | null;
  headline: string | null;
  avatarUrl: string | null;
  phone: string | null;
  countryCode: string | null;
  city: string | null;
  timezone: string | null;
  locale: string;
  websiteUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  instagramUrl: string | null;
  emailNotifications: boolean;
  inAppNotifications: boolean;
};

export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: UserStatus;
  roles: string[];
  permissions: string[];
  profile: AuthUserProfile;
};

export type AuthUserRecord = {
  user: User;
  profile: UserProfile;
  access: AccessSnapshot;
};
