import { z } from "zod";

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./constants";

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "auth.errors.email" }),
  password: z.string().min(1, { message: "auth.errors.passwordRequired" }),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, { message: "auth.errors.nameRequired" }).max(100),
    email: z.string().trim().email({ message: "auth.errors.email" }),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, { message: "auth.errors.passwordLength" })
      .max(PASSWORD_MAX_LENGTH, { message: "auth.errors.passwordLength" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "auth.errors.passwordMismatch",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email({ message: "auth.errors.email" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, { message: "auth.errors.passwordLength" })
      .max(PASSWORD_MAX_LENGTH, { message: "auth.errors.passwordLength" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "auth.errors.passwordMismatch",
  });

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const flattened = error.flatten().fieldErrors as Record<string, string[] | undefined>;

  return Object.fromEntries(
    Object.entries(flattened).flatMap(([field, messages]) =>
      messages?.[0] ? [[field, messages[0]]] : [],
    ),
  );
}

const optionalText = (max: number) => z.string().trim().max(max).optional();

const optionalUrl = z
  .string()
  .trim()
  .max(512)
  .refine((value) => !value || /^https?:\/\//i.test(value), {
    message: "auth.errors.url",
  })
  .optional();

const optionalTimezone = z
  .string()
  .trim()
  .max(64)
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      try {
        new Intl.DateTimeFormat(undefined, { timeZone: value });
        return true;
      } catch {
        return false;
      }
    },
    { message: "auth.errors.timezone" },
  )
  .optional();

const optionalCountryCode = z
  .string()
  .trim()
  .toUpperCase()
  .refine((value) => !value || /^[A-Z]{2}$/.test(value), {
    message: "auth.errors.countryCode",
  })
  .optional();

const optionalUsername = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => !value || /^[a-z0-9_]{3,30}$/.test(value), {
    message: "auth.errors.username",
  })
  .optional();

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, { message: "auth.errors.nameRequired" }).max(100),
  fullName: optionalText(255),
  username: optionalUsername,
  bio: optionalText(500),
  headline: optionalText(120),
  phone: optionalText(32),
  countryCode: optionalCountryCode,
  city: optionalText(100),
  timezone: optionalTimezone,
  locale: z.enum(["id", "en"]),
  websiteUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  xUrl: optionalUrl,
  instagramUrl: optionalUrl,
  emailNotifications: z.boolean(),
  inAppNotifications: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
