export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase().normalize("NFC");
}
