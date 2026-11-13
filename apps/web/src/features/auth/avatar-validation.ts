export const MAX_AVATAR_BYTES = 2_000_000;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "profile.avatar.invalidType";
  }

  if (file.size > MAX_AVATAR_BYTES) {
    return "profile.avatar.tooLarge";
  }

  return null;
}
