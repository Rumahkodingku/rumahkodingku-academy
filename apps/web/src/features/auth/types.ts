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
  locale: "id" | "en";
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
  status: "ACTIVE" | "SUSPENDED" | "DELETED";
  roles: string[];
  permissions: string[];
  profile: AuthUserProfile;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export type ProfilePatch = Partial<
  Pick<
    AuthUserProfile,
    | "displayName"
    | "fullName"
    | "username"
    | "bio"
    | "headline"
    | "phone"
    | "countryCode"
    | "city"
    | "timezone"
    | "locale"
    | "websiteUrl"
    | "githubUrl"
    | "linkedinUrl"
    | "xUrl"
    | "instagramUrl"
    | "emailNotifications"
    | "inAppNotifications"
  >
>;
